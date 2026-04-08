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
var express_1 = require("express");
var UserController_1 = require("../controllers/UserController");
var SessionController_1 = require("../controllers/SessionController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var PermissionController_1 = require("../controllers/PermissionController");
var ClientController_1 = require("../controllers/ClientController");
var ContactController_1 = require("../controllers/ContactController");
var NotificationsController_1 = require("../controllers/NotificationsController");
var GrainContractController_1 = require("../controllers/GrainContractController");
var EmailController_1 = require("../controllers/EmailController");
var ProductController_1 = require("../controllers/ProductController");
var ProductTablesController_1 = require("../controllers/ProductTablesController");
var InvoicesController_1 = require("../controllers/InvoicesController");
var NfseController_1 = require("../controllers/NfseController");
var node_fetch_1 = __importDefault(require("node-fetch"));
var BillingsController_1 = require("../controllers/BillingsController");
var routes = (0, express_1.Router)();
// Utilizar futuramente para criar métricas de chamadas
// routes.use("/api", (req, res, next) => {
//   console.log("Opaaaa!!", req);
//   next();
// });
// IN and OUT application
routes.post("/api/login", new SessionController_1.SessionController().login);
// Proxy para ReceitaWS - Consulta CNPJ (público, sem auth)
routes.get("/api-cnpj/cnpj/:cnpj", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cnpj, response, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cnpj = req.params.cnpj;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, node_fetch_1.default)("https://receitaws.com.br/v1/cnpj/".concat(cnpj))];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                data = _a.sent();
                res.status(response.status).json(data);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                res.status(500).json({
                    status: "ERROR",
                    message: "Erro ao consultar CNPJ",
                    error: error_1.message,
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Routes protected
routes.use(authMiddleware_1.authMiddleware); // comentar ao usar local
routes.get("/api/profile", new UserController_1.UserController().getProfile);
routes.post("/api/reset-password", new SessionController_1.SessionController().resetPassword);
// CRUD USERS
routes.post("/api/user", new UserController_1.UserController().create);
routes.get("/api/users", new UserController_1.UserController().getUsers);
routes.get("/api/users/:id", new UserController_1.UserController().getUserById);
routes.patch("/api/user/:id", new UserController_1.UserController().updateUser);
routes.delete("/api/user/:id", new UserController_1.UserController().deleteUser);
routes.patch("/api/permission/:id", new PermissionController_1.PermissionController().update);
routes.get("/api/user/permissions", new UserController_1.UserController().getPermissionsByEmail);
// v2 Clients
routes.post("/api/client", new ClientController_1.ClientController().create);
routes.get("/api/clients", new ClientController_1.ClientController().getClients);
routes.get("/api/client/client-by-id/:code_client", new ClientController_1.ClientController().getClientById);
routes.get("/api/client/client-by-cnpj-cpf/:cnpj_cpf_client", new ClientController_1.ClientController().getClientByCnpj_cpf);
routes.patch("/api/client/:id", new ClientController_1.ClientController().update);
routes.delete("/api/client/:id", new ClientController_1.ClientController().delete);
// v2 Contatos
routes.post("/api/contact", new ContactController_1.ContactController().create);
routes.get("/api/contact/:code_client", new ContactController_1.ContactController().getContactsByClient);
routes.patch("/api/contact/:id", new ContactController_1.ContactController().update);
routes.delete("/api/contact/:id", new ContactController_1.ContactController().delete);
// Notification
routes.post("/api/notification", new NotificationsController_1.NotificationController().create);
routes.get("/api/notifications", new NotificationsController_1.NotificationController().getNotifications);
routes.get("/api/notification/:id", new NotificationsController_1.NotificationController().getNotificationById);
routes.get("/api/notifications/user/:user", new NotificationsController_1.NotificationController().getNotificationsByUser);
routes.patch("/api/notification/:id", new NotificationsController_1.NotificationController().updateNotification);
routes.delete("/api/notification/:id", new NotificationsController_1.NotificationController().deleteNotification);
// Contracts
routes.get("/api/grain-contracts/report", new GrainContractController_1.GrainContractController().getReport);
routes.get("/api/grain-contracts", new GrainContractController_1.GrainContractController().getGrainContracts);
routes.get("/api/grain-contracts/:id", new GrainContractController_1.GrainContractController().getGrainContractById);
routes.post("/api/grain-contracts", new GrainContractController_1.GrainContractController().createGrainContract);
routes.patch("/api/grain-contracts/:id", new GrainContractController_1.GrainContractController().updateGrainContract);
routes.delete("/api/grain-contracts/:id", new GrainContractController_1.GrainContractController().deleteGrainContract);
routes.patch("/api/grain-contracts/update-contract-adjustments/:id", new GrainContractController_1.GrainContractController().updateContractAdjustments);
// Send Emails
routes.post("/api/send-emails", new EmailController_1.EmailController().SendEmails);
// Products
routes.post("/api/products", ProductController_1.ProductController.createProduct);
routes.get("/api/products", ProductController_1.ProductController.findAllProducts);
routes.get("/api/products/:id", ProductController_1.ProductController.findProductById);
routes.patch("/api/products/:id", ProductController_1.ProductController.updateProduct);
routes.delete("/api/products/:id", ProductController_1.ProductController.deleteProduct);
//Products Table
routes.post("/api/tables-products", ProductTablesController_1.ProductTablesController.createTable);
routes.get("/api/tables-products", ProductTablesController_1.ProductTablesController.findTablesAll);
routes.get("/api/tables-products/:id", ProductTablesController_1.ProductTablesController.findTableById);
routes.patch("/api/tables-products/:id", ProductTablesController_1.ProductTablesController.updateTable);
routes.delete("/api/tables-products/:id", ProductTablesController_1.ProductTablesController.deleteTable);
// Invoices
routes.post("/api/invoices", InvoicesController_1.InvoiceController.createInvoice);
routes.get("/api/invoices/nextrps", InvoicesController_1.InvoiceController.nextNumberRps);
routes.get("/api/invoices", InvoicesController_1.InvoiceController.findAllInvoices);
routes.get("/api/invoices/:id", InvoicesController_1.InvoiceController.findInvoiceById);
routes.get("/api/invoices/rps/:rps_number", InvoicesController_1.InvoiceController.findInvoiceByRps_number);
routes.get("/api/invoices/nfs/:nfs_number", InvoicesController_1.InvoiceController.findInvoiceByNfs_number);
routes.patch("/api/invoices/:id", InvoicesController_1.InvoiceController.updateInvoice);
routes.delete("/api/invoices/:id", InvoicesController_1.InvoiceController.deleteInvoice);
// NFS-e - Emissão de Nota Fiscal Eletrônica SP
routes.post("/api/nfse/enviar-lote", NfseController_1.NfseController.enviarLoteRps);
routes.get("/api/nfse/consultar-lote/:protocolo", NfseController_1.NfseController.consultarLote);
routes.get("/api/nfse/consultar-rps/:rps_number", NfseController_1.NfseController.consultarRps);
routes.post("/api/nfse/cancelar", NfseController_1.NfseController.cancelarNfse);
routes.get("/api/nfse/testar-conexao", NfseController_1.NfseController.testarConexao);
// Billing
routes.post("/api/billings", BillingsController_1.BillingController.createBilling);
routes.post("/api/billings/number-contract", BillingsController_1.BillingController.findBillingsByNumberContract);
routes.get("/api/billings", BillingsController_1.BillingController.findAllBillings);
routes.get("/api/billings/:id", BillingsController_1.BillingController.findBillingById);
routes.get("/api/billings/contract/:number_contract", BillingsController_1.BillingController.findBillingByNumberContract);
routes.get("/api/billings/rps/:rps_number", BillingsController_1.BillingController.findBillingByRps_number);
routes.get("/api/billings/nfs/:nfs_number", BillingsController_1.BillingController.findBillingByNfs_number);
routes.patch("/api/billings/:id", BillingsController_1.BillingController.updateBilling);
routes.delete("/api/billings/:id", BillingsController_1.BillingController.deleteBilling);
exports.default = routes;
//# sourceMappingURL=index.js.map