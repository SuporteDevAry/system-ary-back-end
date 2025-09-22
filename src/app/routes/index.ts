import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { SessionController } from "../controllers/SessionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { PermissionController } from "../controllers/PermissionController";
import { ClientController } from "../controllers/ClientController";
import { ContactController } from "../controllers/ContactController";
import { NotificationController } from "../controllers/NotificationsController";
import { GrainContractController } from "../controllers/GrainContractController";
import { EmailController } from "../controllers/EmailController";
import { ProductController } from "../controllers/ProductController";
import { ProductTablesController } from "../controllers/ProductTablesController";
import { InvoiceController } from "../controllers/InvoicesController";

const routes = Router();

// Utilizar futuramente para criar métricas de chamadas
// routes.use("/api", (req, res, next) => {
//   console.log("Opaaaa!!", req);
//   next();
// });

// IN and OUT application
routes.post("/api/login", new SessionController().login);

// Routes protected
routes.use(authMiddleware); // comentar ao usar local
routes.get("/api/profile", new UserController().getProfile);
routes.post("/api/reset-password", new SessionController().resetPassword);

// CRUD USERS
routes.post("/api/user", new UserController().create);
routes.get("/api/users", new UserController().getUsers);
routes.get("/api/users/:id", new UserController().getUserById);
routes.patch("/api/user/:id", new UserController().updateUser);
routes.delete("/api/user/:id", new UserController().deleteUser);
routes.patch("/api/permission/:id", new PermissionController().update);
routes.get("/api/user/permissions", new UserController().getPermissionsByEmail);

// v2 Clients
routes.post("/api/client", new ClientController().create);
routes.get("/api/clients", new ClientController().getClients);
routes.get(
  "/api/client/client-by-id/:code_client",
  new ClientController().getClientById
);
routes.get(
  "/api/client/client-by-cnpj-cpf/:cnpj_cpf_client",
  new ClientController().getClientByCnpj_cpf
);
routes.patch("/api/client/:id", new ClientController().update);
routes.delete("/api/client/:id", new ClientController().delete);

// v2 Contatos
routes.post("/api/contact", new ContactController().create);
routes.get(
  "/api/contact/:code_client",
  new ContactController().getContactsByClient
);
routes.patch("/api/contact/:id", new ContactController().update);
routes.delete("/api/contact/:id", new ContactController().delete);

// Notification
routes.post("/api/notification", new NotificationController().create);
routes.get("/api/notifications", new NotificationController().getNotifications);
routes.get(
  "/api/notification/:id",
  new NotificationController().getNotificationById
);
routes.get(
  "/api/notifications/user/:user",
  new NotificationController().getNotificationsByUser
);
routes.patch(
  "/api/notification/:id",
  new NotificationController().updateNotification
);
routes.delete(
  "/api/notification/:id",
  new NotificationController().deleteNotification
);

// Contracts
routes.get(
  "/api/grain-contracts",
  new GrainContractController().getGrainContracts
);
routes.get(
  "/api/grain-contracts/:id",
  new GrainContractController().getGrainContractById
);
routes.post(
  "/api/grain-contracts",
  new GrainContractController().createGrainContract
);
routes.patch(
  "/api/grain-contracts/:id",
  new GrainContractController().updateGrainContract
);
routes.delete(
  "/api/grain-contracts/:id",
  new GrainContractController().deleteGrainContract
);

// Send Emails
routes.post("/api/send-emails", new EmailController().SendEmails);

// Products
routes.post("/api/products", ProductController.createProduct);
routes.get("/api/products", ProductController.findAllProducts);
routes.get("/api/products/:id", ProductController.findProductById);
routes.patch("/api/products/:id", ProductController.updateProduct);
routes.delete("/api/products/:id", ProductController.deleteProduct);

//Products Table
routes.post("/api/tables-products", ProductTablesController.createTable);
routes.get("/api/tables-products", ProductTablesController.findTablesAll);
routes.get("/api/tables-products/:id", ProductTablesController.findTableById);
routes.patch("/api/tables-products/:id", ProductTablesController.updateTable);
routes.delete("/api/tables-products/:id", ProductTablesController.deleteTable);

// Invoices
routes.post("/api/invoices", InvoiceController.createInvoice);
routes.get("/api/invoices", InvoiceController.findAllInvoices);
routes.get("/api/invoices/:id", InvoiceController.findInvoiceById);
routes.get("/api/invoices/rps/:rps_number", InvoiceController.findInvoiceByRps_number);
routes.get("/api/invoices/nfs/:nfs_number", InvoiceController.findInvoiceByNfs_number);
routes.patch("/api/invoices/:id", InvoiceController.updateInvoice);
routes.delete("/api/invoices/:id", InvoiceController.deleteInvoice);

export default routes;
