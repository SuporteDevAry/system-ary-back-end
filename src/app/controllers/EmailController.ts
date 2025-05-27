import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import PdfGeneratorNew from "../../pdfGenerator";
import { EmailLogRepository } from "../repositories/EmailLogRepository";
import { folhaDeRostoBuffer } from "../../pdfGenerator/helpers/coverPage";

const signatureEmailImage = path.resolve(
  __dirname,
  "../../pdfGenerator/helpers/assinatura_execucao_mi.png"
);

const signatureEmail = `data:image/jpeg;base64,${fs
  .readFileSync(signatureEmailImage)
  .toString("base64")}`;

export class EmailController {
  async SendEmails(req: Request, res: Response): Promise<void> {
    try {
      const { contractData, templateName, sender, number_contract } = req.body;

      if (!contractData || !templateName || !sender || !number_contract) {
        res.status(400).send({ error: "Campos necessários não informados." });
        return;
      }

      // Extração da sigla
      const sigla = number_contract.split(".")[0].toUpperCase();

      // Grupos de siglas
      const group1 = ["S", "T", "SG", "CN"];
      const group2 = ["O", "OC", "OA", "SB", "EP"];
      const group3 = ["F"];

      const blockEmailsLocal = process.env.BLOCK_SENDER_EMAIL_LOCAL === "true";

      //let fromEmail = process.env.SMTP_USER as string;
      let bccEmails: string[] = [];

      if (!blockEmailsLocal) {
        if (group1.includes(sigla)) {
          //fromEmail = process.env.SMTP_SOY_TABLE!;
          bccEmails = [
            "exec-mi@aryoleofar.com.br",
            "evandro@aryoleofar.com.br",
            "gilberto@aryoleofar.com.br",
            "jhony@aryoleofar.com.br",
            "talita@aryoleofar.com.br",
            "elcio@aryoleofar.com.br",
            "lelis@aryoleofar.com.br",
          ];
        } else if (group2.includes(sigla) || group3.includes(sigla)) {
          //fromEmail = process.env.SMTP_OIL_TABLE!;
          bccEmails = ["ary@aryoleofar.com.br", "lelis@aryoleofar.com.br"];
        }
      } else {
        console.log("🚫 Emails de grupo bloqueados no ambiente local");
      }

      // Regra de Reenvio: Verificar se já foi enviado anteriormente
      const hasPreviousSent = contractData?.status?.history?.some(
        (entry: any) => entry.status === "ENVIADO"
      );

      const subjectPrefix = hasPreviousSent ? "- (CÓPIA CORRETA)" : "";

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
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Enviar e-mail para o vendedor
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: [contractData.list_email_seller],
        bcc: [
          "'Contrato Enviado do Sistema - Vendedor' <suportearyoleofar@gmail.com>",
          ...bccEmails,
        ],
        subject: `Contrato ${number_contract} - Vendedor ${subjectPrefix}`,
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
            filename: "assinatura_execucao_mi.png",
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
        from: process.env.SMTP_USER,
        to: [contractData.list_email_buyer],
        bcc: [
          "'Contrato Enviado do Sistema - Comprador' <suportearyoleofar@gmail.com>",
          ...bccEmails,
        ],
        subject: `Contrato ${number_contract} - Comprador ${subjectPrefix}`,
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
            filename: "assinatura_execucao_mi.png",
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
