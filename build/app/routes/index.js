"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UserController_1 = require("../controllers/UserController");
var SessionController_1 = require("../controllers/SessionController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var PermissionController_1 = require("../controllers/PermissionController");
var ClientesController_1 = require("../controllers/ClientesController");
var ContatosController_1 = require("../controllers/ContatosController");
var routes = (0, express_1.Router)();
// Utilizar futuramente para criar métricas de chamadas
// routes.use("/api", (req, res, next) => {
//   console.log("Opaaaa!!", req);
//   next();
// });
// IN and OUT application
routes.post("/api/login", new SessionController_1.SessionController().login);
routes.post(
    "/api/reset-password",
    new SessionController_1.SessionController().resetPassword
);
// CRUD USERS
routes.post("/api/user", new UserController_1.UserController().create);
routes.get("/api/users", new UserController_1.UserController().getUsers);
routes.get("/api/users/:id", new UserController_1.UserController().getUserById);
routes.patch("/api/user/:id", new UserController_1.UserController().updateUser);
routes.delete(
    "/api/user/:id",
    new UserController_1.UserController().deleteUser
);
routes.patch(
    "/api/permission/:id",
    new PermissionController_1.PermissionController().update
);
// Clientes
routes.post(
    "/api/cliente",
    new ClientesController_1.ClientesController().create
);
routes.get(
    "/api/clientes",
    new ClientesController_1.ClientesController().getClientes
);
routes.get(
    "/api/clientes/:cli_codigo",
    new ClientesController_1.ClientesController().getClienteById
);
routes.patch(
    "/api/cliente/:cli_codigo",
    new ClientesController_1.ClientesController().updateCliente
);
routes.delete(
    "/api/cliente/:cli_codigo",
    new ClientesController_1.ClientesController().deleteCliente
);
// Contatos
routes.post(
    "/api/contato",
    new ContatosController_1.ContatosController().create
);
routes.get(
    "/api/contatos",
    new ContatosController_1.ContatosController().getContatos
);
routes.get(
    "/api/contatos/:cli_codigo/:sequencia",
    new ContatosController_1.ContatosController().getContatosClienteBySeq
);
routes.patch(
    "/api/contato/:cli_codigo/:sequencia",
    new ContatosController_1.ContatosController().updateContato
);
routes.delete(
    "/api/contato/:cli_codigo/:sequencia",
    new ContatosController_1.ContatosController().deleteContato
);
// Routes protected
routes.use(authMiddleware_1.authMiddleware);
routes.get("/api/profile", new UserController_1.UserController().getProfile);
exports.default = routes;
//# sourceMappingURL=index.js.map
