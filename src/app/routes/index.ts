import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { SessionController } from "../controllers/SessionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { PermissionController } from "../controllers/PermissionController";
import { ClientesController } from "../controllers/ClientesController";
import { ContatosController } from "../controllers/ContatosController";
import { ClientController } from "../controllers/ClientController";
import { ContactController } from "../controllers/ContactController";

const routes = Router();

// Utilizar futuramente para criar métricas de chamadas
// routes.use("/api", (req, res, next) => {
//   console.log("Opaaaa!!", req);
//   next();
// });

// IN and OUT application
routes.post("/api/login", new SessionController().login);

// Clientes
routes.post("/api/cliente", new ClientesController().create);
routes.get("/api/clientes", new ClientesController().getClientes);
routes.get(
  "/api/clientes/:cli_codigo",
  new ClientesController().getClienteById
);
routes.patch(
  "/api/cliente/:cli_codigo",
  new ClientesController().updateCliente
);
routes.delete(
  "/api/cliente/:cli_codigo",
  new ClientesController().deleteCliente
);

// Contatos
routes.post("/api/contato", new ContatosController().create);
routes.get("/api/contatos", new ContatosController().getContatos);
routes.get(
  "/api/contatos/:cli_codigo/:sequencia",
  new ContatosController().getContatosClienteBySeq
);
routes.patch(
  "/api/contato/:cli_codigo/:sequencia",
  new ContatosController().updateContato
);
routes.delete(
  "/api/contato/:cli_codigo/:sequencia",
  new ContatosController().deleteContato
);

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

export default routes;
