"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const react_1 = __importDefault(require("react"));
const server_1 = __importDefault(require("react-dom/server"));
const templates_1 = require("./templates");
const PdfGeneratorNew = async ({ data, typeContract, template, }) => {
    try {
        if (!data || !data.quantity) {
            throw new Error("A propriedade 'quantity' está faltando nos dados.");
        }
        const TemplateComponent = templates_1.templates[template];
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
            ${server_1.default.renderToStaticMarkup(react_1.default.createElement(TemplateComponent, { data, typeContract }))}
          </div>
        </body>
      </html>
    `;
        // Configuração do Puppeteer para gerar o PDF
        const browser = await puppeteer_1.default.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        // Configurar o conteúdo da página
        await page.setContent(populatedTemplate, { waitUntil: "networkidle0" });
        // Gerar o PDF
        const pdfBuffer = Buffer.from(await page.pdf({
            format: "A4",
            printBackground: true,
            width: "210mm",
            height: "297mm",
            margin: {
                right: "5mm",
                left: "5mm",
                bottom: "5mm",
            },
            scale: 0.82,
            displayHeaderFooter: false,
            landscape: false, // Mantém orientação retrato
        }));
        // Fechar o browser
        await browser.close();
        return pdfBuffer;
    }
    catch (error) {
        console.error("Erro ao gerar o PDF:", error);
        return null;
    }
};
exports.default = PdfGeneratorNew;
//# sourceMappingURL=index.js.map