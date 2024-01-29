import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { SessionController } from "../controllers/SessionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { PermissionController } from "../controllers/PermissionController";

const routes = Router();

// Utilizar futuramente para criar métricas de chamadas
// routes.use("/api", (req, res, next) => {
//   console.log("Opaaaa!!", req);
//   next();
// });
routes.post("/api/user", new UserController().create);
routes.post("/api/login", new SessionController().login);
routes.post("/api/reset-password", new SessionController().resetPassword);

routes.get("/api/users", new UserController().getUsers);
routes.get("/api/users/:id", new UserController().getUserById);
routes.patch("/api/permission/:id", new PermissionController().update);

routes.use(authMiddleware);
routes.get("/api/profile", new UserController().getProfile);

export default routes;
