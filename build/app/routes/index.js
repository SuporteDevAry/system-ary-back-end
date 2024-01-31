"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UserController_1 = require("../controllers/UserController");
var SessionController_1 = require("../controllers/SessionController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var PermissionController_1 = require("../controllers/PermissionController");
var routes = (0, express_1.Router)();
// Utilizar futuramente para criar métricas de chamadas
// routes.use("/api", (req, res, next) => {
//   console.log("Opaaaa!!", req);
//   next();
// });
routes.post("/api/user", new UserController_1.UserController().create);
routes.post("/api/login", new SessionController_1.SessionController().login);
routes.post("/api/reset-password", new SessionController_1.SessionController().resetPassword);
routes.get("/api/users", new UserController_1.UserController().getUsers);
routes.get("/api/users/:id", new UserController_1.UserController().getUserById);
routes.patch("/api/permission/:id", new PermissionController_1.PermissionController().update);
routes.use(authMiddleware_1.authMiddleware);
routes.get("/api/profile", new UserController_1.UserController().getProfile);
exports.default = routes;
//# sourceMappingURL=index.js.map