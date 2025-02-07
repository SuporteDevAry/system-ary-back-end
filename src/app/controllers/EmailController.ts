import { Request, Response } from "express";
import nodemailer from "nodemailer";
import PdfGeneratorNew from "../../pdfGenerator";
import { EmailLogRepository } from "../repositories/EmailLogRepository";

export class EmailController {
  async SendEmails(req: Request, res: Response): Promise<void> {
    try {
      const { contractData, templateName, sender, number_contract } = req.body;

      if (!contractData || !templateName || !sender || !number_contract) {
        res.status(400).send({ error: "Campos necessários não informados." });
        return;
      }

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
        ],
        subject: `Contrato ${number_contract} - Vendedor`,
        text: `Segue o contrato ${number_contract} em anexo.`,
        html: ` 
          <div style="font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 14px; line-height: 21px;">
            <p>Prezado ${contractData.seller.name}</p>
            <p>Segue anexo uma (01) cópia de nossa confirmação, solicitamos carimbar e assinar a mesma e nos devolver por e-mail o mais breve possível.</p>

            <p>Agradecemos e nos colocamos a sua disposição.</p>
            <br/>
            <small style="font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 12px; line-height: 14px;">Este contrato foi criado e enviado via sistema.</small>
          </div>`,
        attachments: [
          {
            filename: `contrato_${number_contract}_vendedor.pdf`,
            content: pdfSeller,
          },
        ],
      });

      // Enviar e-mail para o comprador
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: [contractData.list_email_buyer],
        bcc: [
          "'Contrato Enviado do Sistema - Comprador' <suportearyoleofar@gmail.com>",
        ],
        subject: `Contrato ${number_contract} - Comprador`,
        text: `Segue o contrato ${number_contract} em anexo.`,
        html: `
          <div style="font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 14px; line-height: 21px;">
            <p>Prezado ${contractData.buyer.name}</p>
            <p>Segue anexo uma (01) cópia de nossa confirmação, solicitamos carimbar e assinar a mesma e nos devolver por e-mail o mais breve possível.</p>

            <p>Agradecemos e nos colocamos a sua disposição.</p>
            <br/>
            <small style="font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 12px; line-height: 14px;">Este contrato foi criado e enviado via sistema.</small>
          </div>`,
        attachments: [
          {
            filename: `contrato_${number_contract}_comprador.pdf`,
            content: pdfBuyer,
          },
        ],
      });

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
