"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer_1 = __importDefault(require("puppeteer"));
var react_1 = __importDefault(require("react"));
var server_1 = __importDefault(require("react-dom/server"));
var templates_1 = require("./templates");
var PdfGeneratorNew = function (_a) {
    var data = _a.data, typeContract = _a.typeContract, template = _a.template;
    return __awaiter(void 0, void 0, void 0, function () {
        var TemplateComponent, populatedTemplate, browser, page, pdfBuffer, _b, _c, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 6, , 7]);
                    if (!data || !data.quantity) {
                        throw new Error("A propriedade 'quantity' está faltando nos dados.");
                    }
                    TemplateComponent = templates_1.templates[template];
                    if (!TemplateComponent) {
                        throw new Error("Template \"".concat(template, "\" n\u00E3o encontrado."));
                    }
                    populatedTemplate = "\n      <html>\n        <head>\n          <style>\n            /* Adicione aqui os estilos globais para o PDF */\n            body {\n              font-family: Arial, sans-serif;\n            }\n              #contrato {\n              width: 210mm; /* Largura fixa para A4 */\n              height: 297mm; /* Altura fixa para A4 */\n              page-break-inside: avoid; /* Evitar quebras internas */\n              page-break-before: auto; /* Evitar quebras antes */\n              page-break-after: auto; /* Evitar quebras depois */\n              word-wrap: break-word; /* Quebra palavras longas */\n              word-break: break-word; /* Quebra de palavras */\n             \n            }\n             \n          </style>\n        </head>\n        <body>\n          <div id=\"contrato\">\n            ".concat(server_1.default.renderToStaticMarkup(react_1.default.createElement(TemplateComponent, { data: data, typeContract: typeContract })), "\n          </div>\n        </body>\n      </html>\n    ");
                    return [4 /*yield*/, puppeteer_1.default.launch({
                            headless: true,
                            args: ["--no-sandbox", "--disable-setuid-sandbox"],
                        })];
                case 1:
                    browser = _d.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _d.sent();
                    // Configurar o conteúdo da página
                    return [4 /*yield*/, page.setContent(populatedTemplate, { waitUntil: "networkidle0" })];
                case 3:
                    // Configurar o conteúdo da página
                    _d.sent();
                    _c = (_b = Buffer).from;
                    return [4 /*yield*/, page.pdf({
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
                        })];
                case 4:
                    pdfBuffer = _c.apply(_b, [_d.sent()]);
                    // Fechar o browser
                    return [4 /*yield*/, browser.close()];
                case 5:
                    // Fechar o browser
                    _d.sent();
                    return [2 /*return*/, pdfBuffer];
                case 6:
                    error_1 = _d.sent();
                    console.error("Erro ao gerar o PDF:", error_1);
                    return [2 /*return*/, null];
                case 7: return [2 /*return*/];
            }
        });
    });
};
exports.default = PdfGeneratorNew;
//# sourceMappingURL=index.js.map