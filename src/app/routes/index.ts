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

const routes = Router();

// Utilizar futuramente para criar métricas de chamadas
// routes.use("/api", (req, res, next) => {
//   console.log("Opaaaa!!", req);
//   next();
// });

// IN and OUT application
routes.post("/api/login", new SessionController().login);

// Routes protected
routes.use(authMiddleware);
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

routes.post("/api/send-emails", new EmailController().SendEmails);

export default routes;
