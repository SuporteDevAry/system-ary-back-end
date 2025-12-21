import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import PdfGeneratorNew from "../../pdfGenerator";
import { EmailLogRepository } from "../repositories/EmailLogRepository";
import { folhaDeRostoBuffer } from "../../pdfGenerator/helpers/coverPage";

const signatureEmailImageSoy = path.resolve(
  __dirname,
  "../../pdfGenerator/helpers/assinatura_execucao_mi.png"
);

const signatureEmailImageOil = path.resolve(
  __dirname,
  "../../pdfGenerator/helpers/assinatura_oleo.png"
);

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
          smtpUser
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

  async GetEmailIndicators(req: Request, res: Response): Promise<void> {
    try {
      // Buscar todos os logs de e-mail ordenados por data
      const emailLogs = await EmailLogRepository.find({
        order: { sent_at: "DESC" },
      });

      console.log("📊 Total de registros na base:", emailLogs.length);

      // Grupos de siglas por mesa
      const group1 = ["S", "T", "SG", "CN"]; // Grãos
      const group2 = ["O", "OC", "OA", "SB", "EP"]; // Óleo
      const group3 = ["F"]; // Farelo

      // Usar Set para contratos únicos (elimina duplicatas de reenvios)
      const contratosUnicos = new Set<string>();
      const contratosUnicosGraos = new Set<string>();
      const contratosUnicosOleo = new Set<string>();
      const contratosUnicosFarelo = new Set<string>();
      const contratosUnicosME = new Set<string>();
      const siglasSemClassificacao: string[] = [];

      // Estrutura para agrupar por ano e mês
      const porAno: Record<
        string,
        {
          total: number;
          por_mes: Record<
            string,
            {
              total: number;
              contratos: Array<{
                sigla: string;
                number_contract: string;
                data_hora: string;
                enviado_por: string;
                sent_at_timestamp?: Date;
              }>;
            }
          >;
        }
      > = {};

      // Processar cada log
      emailLogs.forEach((log) => {
        const sigla = log.number_contract.split(".")[0].toUpperCase();
        const numeroContrato = log.number_contract;

        // Adicionar ao total de contratos únicos
        contratosUnicos.add(numeroContrato);

        // Classificar por mesa e mercado
        if (group1.includes(sigla)) {
          contratosUnicosGraos.add(numeroContrato);
        } else if (group2.includes(sigla)) {
          contratosUnicosOleo.add(numeroContrato);
        } else if (group3.includes(sigla)) {
          contratosUnicosFarelo.add(numeroContrato);
        } else {
          // Siglas não reconhecidas serão classificadas como Mercado Externo no futuro
          contratosUnicosME.add(numeroContrato);
          if (!siglasSemClassificacao.includes(sigla)) {
            siglasSemClassificacao.push(sigla);
          }
        }

        // Agrupar por ano e mês
        const data = new Date(log.sent_at);
        const ano = data.getFullYear().toString();
        const mesesAbreviados = [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ];
        const mes = mesesAbreviados[data.getMonth()];
        const dataHora = data.toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        });

        // Inicializar ano se não existir
        if (!porAno[ano]) {
          porAno[ano] = { total: 0, por_mes: {} };
        }

        // Inicializar mês se não existir
        if (!porAno[ano].por_mes[mes]) {
          porAno[ano].por_mes[mes] = { total: 0, contratos: [] };
        }

        // Adicionar contrato ao mês
        porAno[ano].por_mes[mes].contratos.push({
          sigla,
          number_contract: numeroContrato,
          data_hora: dataHora,
          enviado_por: log.email_sender,
          sent_at_timestamp: log.sent_at, // Guardar timestamp para ordenação
        });

        // Incrementar contadores
        porAno[ano].por_mes[mes].total++;
        porAno[ano].total++;
      });

      // Ordenar os contratos dentro de cada mês por data crescente
      Object.keys(porAno).forEach((ano) => {
        Object.keys(porAno[ano].por_mes).forEach((mes) => {
          porAno[ano].por_mes[mes].contratos.sort(
            (a: any, b: any) =>
              new Date(a.sent_at_timestamp).getTime() -
              new Date(b.sent_at_timestamp).getTime()
          );
          // Remover o timestamp auxiliar após ordenar
          porAno[ano].por_mes[mes].contratos.forEach((contrato: any) => {
            delete contrato.sent_at_timestamp;
          });
        });
      });

      const totalContratos = contratosUnicos.size;
      const mesaGraos = contratosUnicosGraos.size;
      const mesaOleo = contratosUnicosOleo.size;
      const mesaFarelo = contratosUnicosFarelo.size;
      const totalMI = mesaGraos + mesaOleo + mesaFarelo; // Mercado Interno
      const totalME = contratosUnicosME.size; // Mercado Externo

      console.log(
        "📊 Total envios:",
        emailLogs.length,
        "| Contratos únicos:",
        totalContratos
      );
      console.log("🔍 Siglas sem classificação:", siglasSemClassificacao);

      // Ordenar os meses dentro de cada ano (Jan a Dez)
      const mesesOrdem = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];
      const porAnoOrdenado: Record<string, any> = {};
      Object.keys(porAno)
        .sort()
        .forEach((ano) => {
          const mesesOrdenados: Record<string, any> = {};
          // Ordenar meses conforme a ordem do array
          mesesOrdem.forEach((mes) => {
            if (porAno[ano].por_mes[mes]) {
              mesesOrdenados[mes] = porAno[ano].por_mes[mes];
            }
          });
          porAnoOrdenado[ano] = {
            total: porAno[ano].total,
            por_mes: mesesOrdenados,
          };
        });

      res.status(200).json({
        total_envios: emailLogs.length,
        total_contratos_enviados: totalContratos,
        mercado_interno: totalMI,
        mercado_externo: totalME,
        por_mesa: {
          graos: mesaGraos,
          oleo: mesaOleo,
          farelo: mesaFarelo,
        },
        por_ano: porAnoOrdenado,
        siglas_sem_classificacao: siglasSemClassificacao,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Erro ao buscar indicadores de e-mails." });
    }
  }
}
