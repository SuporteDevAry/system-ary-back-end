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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
var path_1 = __importDefault(require("path"));
var nodemailer_1 = __importDefault(require("nodemailer"));
var pdfGenerator_1 = __importDefault(require("../../pdfGenerator"));
var EmailLogRepository_1 = require("../repositories/EmailLogRepository");
var coverPage_1 = require("../../pdfGenerator/helpers/coverPage");
var signatureEmailImageSoy = path_1.default.resolve(__dirname, "../../pdfGenerator/helpers/assinatura_execucao_mi.png");
var signatureEmailImageOil = path_1.default.resolve(__dirname, "../../pdfGenerator/helpers/assinatura_oleo.png");
var EmailController = /** @class */ (function () {
    function EmailController() {
    }
    EmailController.prototype.SendEmails = function (req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, contractData, templateName, sender, number_contract, sigla, group1, group2, group3, isLocal, signatureFileName, signatureEmailImage, smtpUser, smtpPass, bccEmails, hasPreviousSent, subjectPrefix, nameSeller, nameBuyer, pdfSeller, pdfBuyer, transporter, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, , 7]);
                        _c = req.body, contractData = _c.contractData, templateName = _c.templateName, sender = _c.sender, number_contract = _c.number_contract;
                        if (!contractData || !templateName || !sender || !number_contract) {
                            res.status(400).send({ error: "Campos necessários não informados." });
                            return [2 /*return*/];
                        }
                        sigla = number_contract.split(".")[0].toUpperCase();
                        group1 = ["S", "T", "SG", "CN"];
                        group2 = ["O", "OC", "OA", "SB", "EP"];
                        group3 = ["F"];
                        isLocal = process.env.BLOCK_SENDER_EMAIL_LOCAL === "true";
                        signatureFileName = "";
                        signatureEmailImage = "";
                        smtpUser = process.env.SMTP_USER;
                        smtpPass = process.env.SMTP_PASS;
                        bccEmails = [];
                        //Regra de Remetente por Mesa: Soja e Óleo!
                        if (group1.includes(sigla)) {
                            signatureFileName = "assinatura_execucao_mi.png";
                            signatureEmailImage = signatureEmailImageSoy;
                            smtpUser = process.env.SMTP_SOY_USER;
                            smtpPass = process.env.SMTP_SOY_PASS;
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
                        }
                        else if (group2.includes(sigla)) {
                            signatureFileName = "assinatura_oleo.png";
                            signatureEmailImage = signatureEmailImageOil;
                            smtpUser = process.env.SMTP_OIL_USER;
                            smtpPass = process.env.SMTP_OIL_PASS;
                            bccEmails = isLocal
                                ? ["andre.camargo500@gmail.com", "carlos@casinfo.com.br"]
                                : [
                                    "ary@aryoleofar.com.br",
                                    "beto@aryoleofar.com.br",
                                    "nilo@aryoleofar.com.br",
                                    "renan@aryoleofar.com.br",
                                    "gustavo@aryoleofar.com.br",
                                ];
                        }
                        else if (group3.includes(sigla)) {
                            signatureFileName = "assinatura_oleo.png";
                            signatureEmailImage = signatureEmailImageOil;
                            smtpUser = process.env.SMTP_OIL_USER;
                            smtpPass = process.env.SMTP_OIL_PASS;
                            bccEmails = isLocal
                                ? ["andre.camargo500@gmail.com", "carlos@casinfo.com.br"]
                                : ["ary@aryoleofar.com.br"];
                        }
                        if (isLocal) {
                            console.log("🚫 Ambiente local: remetente configurado para teste.", smtpUser);
                        }
                        hasPreviousSent = contractData.copy_correct;
                        subjectPrefix = hasPreviousSent ? "- (CÓPIA CORRETA)" : "";
                        nameSeller = ((_a = contractData.seller) === null || _a === void 0 ? void 0 : _a.nickname)
                            ? contractData.seller.nickname
                            : contractData.seller.name;
                        nameBuyer = ((_b = contractData.buyer) === null || _b === void 0 ? void 0 : _b.nickname)
                            ? contractData.buyer.nickname
                            : contractData.buyer.name;
                        return [4 /*yield*/, (0, pdfGenerator_1.default)({
                                data: contractData,
                                typeContract: "Vendedor",
                                template: templateName,
                            })];
                    case 1:
                        pdfSeller = _d.sent();
                        return [4 /*yield*/, (0, pdfGenerator_1.default)({
                                data: contractData,
                                typeContract: "Comprador",
                                template: templateName,
                            })];
                    case 2:
                        pdfBuyer = _d.sent();
                        transporter = nodemailer_1.default.createTransport({
                            host: process.env.SMTP_HOST,
                            port: parseInt(process.env.SMTP_PORT, 10),
                            secure: process.env.SMTP_SECURE === "true",
                            auth: {
                                user: smtpUser,
                                pass: smtpPass,
                            },
                        });
                        // Enviar e-mail para o vendedor
                        return [4 /*yield*/, transporter.sendMail({
                                from: smtpUser,
                                to: [contractData.list_email_seller],
                                bcc: __spreadArray([
                                    "'Contrato Enviado do Sistema - Vendedor' <suportearyoleofar@gmail.com>"
                                ], bccEmails, true),
                                subject: "Contrato ".concat(number_contract, " - ").concat(nameSeller, " (X) ").concat(nameBuyer, " ").concat(subjectPrefix),
                                text: "Segue o contrato ".concat(number_contract, " em anexo."),
                                html: " \n          <div style=\"font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 14px; line-height: 21px;\">\n            <p>Prezado ".concat(contractData.seller.name, "</p>\n            <p>Segue anexo uma (01) c\u00F3pia de nossa confirma\u00E7\u00E3o, solicitamos carimbar e assinar a mesma e nos devolver por e-mail o mais breve poss\u00EDvel.</p>\n\n            <p>Agradecemos e nos colocamos a sua disposi\u00E7\u00E3o.</p>\n            <br/>\n\n            <p>Sauda\u00E7\u00F5es,</p>\n           \n\n            <img src=\"cid:assinaturaemail\" alt=\"Assinatura\" style=\"max-width: 300px; height: auto;\" />\n            <br/>\n\n            <small style=\"font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 12px; line-height: 14px;\">Este contrato foi criado e enviado via sistema, pedimos a gentileza que confirme o recebimento.</small>\n          </div>"),
                                attachments: [
                                    {
                                        filename: "contrato_".concat(number_contract, "_vendedor.pdf"),
                                        content: pdfSeller,
                                    },
                                    {
                                        filename: signatureFileName,
                                        path: signatureEmailImage,
                                        cid: "assinaturaemail",
                                    },
                                    {
                                        filename: "folha_de_rosto_".concat(number_contract, ".txt"),
                                        content: coverPage_1.folhaDeRostoBuffer,
                                    },
                                ],
                            })];
                    case 3:
                        // Enviar e-mail para o vendedor
                        _d.sent();
                        // Enviar e-mail para o comprador
                        return [4 /*yield*/, transporter.sendMail({
                                from: smtpUser,
                                to: [contractData.list_email_buyer],
                                bcc: __spreadArray([
                                    "'Contrato Enviado do Sistema - Comprador' <suportearyoleofar@gmail.com>"
                                ], bccEmails, true),
                                subject: "Contrato ".concat(number_contract, " - ").concat(nameSeller, " (X) ").concat(nameBuyer, " ").concat(subjectPrefix),
                                text: "Segue o contrato ".concat(number_contract, " em anexo."),
                                html: "\n          <div style=\"font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 14px; line-height: 21px;\">\n            <p>Prezado ".concat(contractData.buyer.name, "</p>\n            <p>Segue anexo uma (01) c\u00F3pia de nossa confirma\u00E7\u00E3o, solicitamos carimbar e assinar a mesma e nos devolver por e-mail o mais breve poss\u00EDvel.</p>\n\n            <p>Agradecemos e nos colocamos a sua disposi\u00E7\u00E3o.</p>\n            <br/>\n\n            <p>Sauda\u00E7\u00F5es,</p>\n            \n\n            <img src=\"cid:assinaturaemail\" alt=\"Assinatura\" style=\"max-width: 300px; height: auto;\" />\n            <br/>\n              \n            <small style=\"font-family: 'Courier New', Courier, monospace, Arial, sans-serif; font-weight: 400; color: rgb(0, 0, 0); font-size: 12px; line-height: 14px;\">Este contrato foi criado e enviado via sistema, pedimos a gentileza que confirme o recebimento.</small>\n          </div>"),
                                attachments: [
                                    {
                                        filename: "contrato_".concat(number_contract, "_comprador.pdf"),
                                        content: pdfBuyer,
                                    },
                                    {
                                        filename: signatureFileName,
                                        path: signatureEmailImage,
                                        cid: "assinaturaemail",
                                    },
                                    {
                                        filename: "folha_de_rosto_".concat(number_contract, ".txt"),
                                        content: coverPage_1.folhaDeRostoBuffer,
                                    },
                                ],
                            })];
                    case 4:
                        // Enviar e-mail para o comprador
                        _d.sent();
                        // anexar folha de rosto no email
                        return [4 /*yield*/, EmailLogRepository_1.EmailLogRepository.save({
                                email_sender: sender,
                                number_contract: number_contract,
                                sent_at: new Date(),
                            })];
                    case 5:
                        // anexar folha de rosto no email
                        _d.sent();
                        res.status(200).send({ message: "E-mails enviados com sucesso!" });
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _d.sent();
                        console.error(error_1);
                        res.status(500).send({ error: "Erro ao enviar os e-mails." });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return EmailController;
}());
exports.EmailController = EmailController;
//# sourceMappingURL=EmailController.js.map