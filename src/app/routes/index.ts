import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { SessionController } from "../controllers/SessionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { PermissionController } from "../controllers/PermissionController";
import { ClienteController } from "../controllers/ClienteController";

const routes = Router();

// Utilizar futuramente para criar métricas de chamadas
// routes.use("/api", (req, res, next) => {
//   console.log("Opaaaa!!", req);
//   next();
// });

// IN and OUT application
routes.post("/api/login", new SessionController().login);
routes.post("/api/reset-password", new SessionController().resetPassword);

// CRUD USERS
routes.post("/api/user", new UserController().create);
routes.get("/api/users", new UserController().getUsers);
routes.get("/api/users/:id", new UserController().getUserById);
routes.patch("/api/user/:id", new UserController().updateUser);
routes.delete("/api/user/:id", new UserController().deleteUser);
routes.patch("/api/permission/:id", new PermissionController().update);

// Clientes
routes.post("/api/cliente", new ClienteController().create);
routes.get("/api/clientes", new ClienteController().getClientes);
routes.get("/api/clientes/:cli_codigo", new ClienteController().getClienteById);
routes.patch("/api/cliente/:cli_codigo", new ClienteController().updateCliente);
routes.delete("/api/cliente/:cli_codigo", new ClienteController().deleteCliente);

// Routes protected
routes.use(authMiddleware);
routes.get("/api/profile", new UserController().getProfile);

export default routes;
