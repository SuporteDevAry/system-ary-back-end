import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import PdfGeneratorNew from "../../pdfGenerator";
import { EmailLogRepository } from "../repositories/EmailLogRepository";
import { folhaDeRostoBuffer } from "../../pdfGenerator/helpers/coverPage";
import { grainContractRepository } from "../repositories/GrainContractRepository";

const signatureEmailImageSoy = path.resolve(
  __dirname,
  "../../pdfGenerator/helpers/assinatura_execucao_mi.png",
);

const signatureEmailImageOil = path.resolve(
  __dirname,
  "../../pdfGenerator/helpers/assinatura_oleo.png",
);

export class EmailController {
  async SendEmails(req: Request, res: Response): Promise<void> {
    try {
      const { contractData, templateName, sender, number_contract } = req.body;

      if (!contractData || !templateName || !sender || !number_contract) {
        res.status(400).send({ error: "Campos necessários não informados." });
        return;
      }

      // DEBUG: Log dos dados recebidos do front-end
      console.log("[EmailController] Dados de comissão recebidos:", {
        commission_seller: contractData.commission_seller,
        commission_seller_contract_value:
          contractData.commission_seller_contract_value,
        type_commission_seller: contractData.type_commission_seller,
        commission_buyer: contractData.commission_buyer,
        commission_buyer_contract_value:
          contractData.commission_buyer_contract_value,
        type_commission_buyer: contractData.type_commission_buyer,
      });

      // Se os valores calculados não vieram do front-end, buscar do banco de dados
      if (
        contractData.id &&
        (contractData.commission_seller_contract_value === undefined ||
          contractData.commission_buyer_contract_value === undefined)
      ) {
        console.log(
          "[EmailController] Buscando valores calculados do banco de dados..."
        );
        const dbContract = await grainContractRepository.findOne({
          where: { id: contractData.id },
        });

        if (dbContract) {
          // Sobrescrever com os valores do banco
          contractData.commission_seller_contract_value =
            dbContract.commission_seller_contract_value;
          contractData.commission_buyer_contract_value =
            dbContract.commission_buyer_contract_value;
          contractData.type_commission_seller_currency =
            dbContract.type_commission_seller_currency;
          contractData.type_commission_buyer_currency =
            dbContract.type_commission_buyer_currency;

          console.log("[EmailController] Valores do banco de dados:", {
            commission_seller_contract_value:
              dbContract.commission_seller_contract_value,
            commission_buyer_contract_value:
              dbContract.commission_buyer_contract_value,
          });
        }
      }

      // Extração da sigla
      const sigla = number_contract.split(".")[0].toUpperCase();

      // Poderá ser mudado se criarem outras mesas além dessas.
      // Grupos de siglas
      const group1 = ["S", "T", "SG", "CN"];
      const group2 = ["O", "OC", "OA", "SB", "EP"];
      const group3 = ["F"];

      const isLocal = process.env.BLOCK_SENDER_EMAIL_LOCAL === "true";

      let signatureFileName = "";
      let signatureEmailImage = "";
      let smtpUser = process.env.SMTP_USER!;
      let smtpPass = process.env.SMTP_PASS!;
      let bccEmails: string[] = [];

      //Regra de Remetente por Mesa: Soja e Óleo!
      if (group1.includes(sigla)) {
        signatureFileName = "assinatura_execucao_mi.png";
        signatureEmailImage = signatureEmailImageSoy;
        smtpUser = process.env.SMTP_SOY_USER!;
        smtpPass = process.env.SMTP_SOY_PASS!;
        bccEmails = isLocal
          ? ["andre.camargo500@gmail.com", "carlos@casinfo.com.br"]
          : [
              "exec-mi@aryoleofar.com.br",
              "evandro@aryoleofar.com.br",
              "gilberto@aryoleofar.com.br",
              "jhony@aryoleofar.com.br",
              "talita@aryoleofar.com.br",
              "elcio@aryoleofar.com.br",
            ];
      } else if (group2.includes(sigla)) {
        signatureFileName = "assinatura_oleo.png";
        signatureEmailImage = signatureEmailImageOil;
        smtpUser = process.env.SMTP_OIL_USER!;
        smtpPass = process.env.SMTP_OIL_PASS!;
        bccEmails = isLocal
          ? ["andre.camargo500@gmail.com", "carlos@casinfo.com.br"]
          : [
              "ary@aryoleofar.com.br",
              "beto@aryoleofar.com.br",
              "nilo@aryoleofar.com.br",
              "renan@aryoleofar.com.br",
              "gustavo@aryoleofar.com.br",
            ];
      } else if (group3.includes(sigla)) {
        signatureFileName = "assinatura_oleo.png";
        signatureEmailImage = signatureEmailImageOil;
        smtpUser = process.env.SMTP_OIL_USER!;
        smtpPass = process.env.SMTP_OIL_PASS!;
        bccEmails = isLocal
          ? ["andre.camargo500@gmail.com", "carlos@casinfo.com.br"]
          : ["ary@aryoleofar.com.br"];
      }

      if (isLocal) {
        console.log(
          "🚫 Ambiente local: remetente configurado para teste.",
          smtpUser,
        );
      }

      const hasPreviousSent = contractData.copy_correct;
      const subjectPrefix = hasPreviousSent ? "- (CÓPIA CORRETA)" : "";

      const nameSeller = contractData.seller?.nickname
        ? contractData.seller.nickname
        : contractData.seller.name;

      const nameBuyer = contractData.buyer?.nickname
        ? contractData.buyer.nickname
        : contractData.buyer.name;

      // Gerar o PDF para o vendedor
      const pdfSeller = await PdfGeneratorNew({
        data: contractData,
        typeContract: "Vendedor",
        template: templateName,
      });

      // Gerar o PDF para o comprador
      const pdfBuyer = await PdfGeneratorNew({
        data: contractData,
        typeContract: "Comprador",
        template: templateName,
      });

      // Configuração do Nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Enviar e-mail para o vendedor
      await transporter.sendMail({
        from: smtpUser,
        to: [contractData.list_email_seller],
        bcc: [
          "'Contrato Enviado do Sistema - Vendedor' <suportearyoleofar@gmail.com>",
          ...bccEmails,
        ],
        subject: `Contrato ${number_contract} - ${nameSeller} (X) ${nameBuyer} ${subjectPrefix}`,
        text: `Segue o contrato ${number_contract} em anexo.`,
        html: ` 
          <div style="font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 14px; line-height: 21px;">
            <p>Prezado ${contractData.seller.name}</p>
            <p>Segue anexo uma (01) cópia de nossa confirmação, solicitamos carimbar e assinar a mesma e nos devolver por e-mail o mais breve possível.</p>

            <p>Agradecemos e nos colocamos a sua disposição.</p>
            <br/>

            <p>Saudações,</p>
           

            <img src="cid:assinaturaemail" alt="Assinatura" style="max-width: 300px; height: auto;" />
            <br/>

            <small style="font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 12px; line-height: 14px;">Este contrato foi criado e enviado via sistema, pedimos a gentileza que confirme o recebimento.</small>
          </div>`,
        attachments: [
          {
            filename: `contrato_${number_contract}_vendedor.pdf`,
            content: pdfSeller,
          },
          {
            filename: signatureFileName,
            path: signatureEmailImage,
            cid: "assinaturaemail",
          },
          {
            filename: `folha_de_rosto_${number_contract}.txt`,
            content: folhaDeRostoBuffer,
          },
        ],
      });

      // Enviar e-mail para o comprador
      await transporter.sendMail({
        from: smtpUser,
        to: [contractData.list_email_buyer],
        bcc: [
          "'Contrato Enviado do Sistema - Comprador' <suportearyoleofar@gmail.com>",
          ...bccEmails,
        ],
        subject: `Contrato ${number_contract} - ${nameSeller} (X) ${nameBuyer} ${subjectPrefix}`,
        text: `Segue o contrato ${number_contract} em anexo.`,
        html: `
          <div style="font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 14px; line-height: 21px;">
            <p>Prezado ${contractData.buyer.name}</p>
            <p>Segue anexo uma (01) cópia de nossa confirmação, solicitamos carimbar e assinar a mesma e nos devolver por e-mail o mais breve possível.</p>

            <p>Agradecemos e nos colocamos a sua disposição.</p>
            <br/>

            <p>Saudações,</p>
            

            <img src="cid:assinaturaemail" alt="Assinatura" style="max-width: 300px; height: auto;" />
            <br/>
              
            <small style="font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 12px; line-height: 14px;">Este contrato foi criado e enviado via sistema, pedimos a gentileza que confirme o recebimento.</small>
          </div>`,
        attachments: [
          {
            filename: `contrato_${number_contract}_comprador.pdf`,
            content: pdfBuyer,
          },
          {
            filename: signatureFileName,
            path: signatureEmailImage,
            cid: "assinaturaemail",
          },
          {
            filename: `folha_de_rosto_${number_contract}.txt`,
            content: folhaDeRostoBuffer,
          },
        ],
      });

      // anexar folha de rosto no email

      await EmailLogRepository.save({
        email_sender: sender,
        number_contract,
        sent_at: new Date(),
      });

      res.status(200).send({ message: "E-mails enviados com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Erro ao enviar os e-mails." });
    }
  }
}
