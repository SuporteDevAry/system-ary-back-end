import puppeteer from "puppeteer";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { templates } from "./templates";

interface IPdfGenerator {
  data: any;
  typeContract: "Vendedor" | "Comprador";
  template: keyof typeof templates;
}

const PdfGeneratorNew = async ({
  data,
  typeContract,
  template,
}: IPdfGenerator): Promise<Buffer | null> => {
  try {
    if (!data || !data.quantity) {
      throw new Error("A propriedade 'quantity' está faltando nos dados.");
    }

    const TemplateComponent = templates[template];
    if (!TemplateComponent) {
      throw new Error(`Template "${template}" não encontrado.`);
    }

    // Renderizar o HTML do componente React
    const populatedTemplate = `
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap" rel="stylesheet">
          <style>
            body, p, span {
              font-family: 'Roboto', sans-serif;
            }

            #contrato {
              width: 210mm;
              height: 297mm;
            }
              
          </style>
        </head>
        <body>
          <div id="contrato">
            ${ReactDOMServer.renderToStaticMarkup(
              React.createElement(TemplateComponent, { data, typeContract })
            )}
          </div>
        </body>
      </html>
    `;

    // Configuração do Puppeteer para gerar o PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Configurar o conteúdo da página
    await page.setContent(populatedTemplate, { waitUntil: "networkidle0" });

    // Gerar o PDF
    const pdfBuffer = Buffer.from(
      await page.pdf({
        format: "A4",
        printBackground: true,
        width: "210mm", // Largura da página A4
        height: "297mm", // Altura da página A4
        margin: {
          right: "5mm",
          left: "5mm",
          bottom: "5mm",
        },
        scale: 0.82, // Ajusta o zoom para caber na página A4
        displayHeaderFooter: false, // Desativa cabeçalhos e rodapés
        landscape: false, // Mantém orientação retrato
      })
    );

    // Fechar o browser
    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    return null;
  }
};

export default PdfGeneratorNew;
