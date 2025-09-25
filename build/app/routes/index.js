"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UserController_1 = require("../controllers/UserController");
var SessionController_1 = require("../controllers/SessionController");
var PermissionController_1 = require("../controllers/PermissionController");
var ClientController_1 = require("../controllers/ClientController");
var ContactController_1 = require("../controllers/ContactController");
var NotificationsController_1 = require("../controllers/NotificationsController");
var GrainContractController_1 = require("../controllers/GrainContractController");
var EmailController_1 = require("../controllers/EmailController");
var ProductController_1 = require("../controllers/ProductController");
var ProductTablesController_1 = require("../controllers/ProductTablesController");
var InvoicesController_1 = require("../controllers/InvoicesController");
var routes = (0, express_1.Router)();
// Utilizar futuramente para criar métricas de chamadas
// routes.use("/api", (req, res, next) => {
//   console.log("Opaaaa!!", req);
//   next();
// });
// IN and OUT application
routes.post("/api/login", new SessionController_1.SessionController().login);
// Routes protected
//routes.use(authMiddleware); // comentar ao usar local
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
routes.get("/api/invoices", InvoicesController_1.InvoiceController.findAllInvoices);
routes.get("/api/invoices/:id", InvoicesController_1.InvoiceController.findInvoiceById);
routes.get("/api/invoices/rps/:rps_number", InvoicesController_1.InvoiceController.findInvoiceByRps_number);
routes.get("/api/invoices/nfs/:nfs_number", InvoicesController_1.InvoiceController.findInvoiceByNfs_number);
routes.patch("/api/invoices/:id", InvoicesController_1.InvoiceController.updateInvoice);
routes.delete("/api/invoices/:id", InvoicesController_1.InvoiceController.deleteInvoice);
routes.get("/api/invoices/nextrps", InvoicesController_1.InvoiceController.nextNumberRps);
exports.default = routes;
//# sourceMappingURL=index.js.map