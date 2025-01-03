import "express-async-errors";
import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./database/data-source";
import routes from "./app/routes";

//Error middleware fazer aqui para eliminar try catch no app
import { errorMiddleware } from "./app/middlewares/error";

const port = process.env.SERVER_PORT;
const app = express();

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(routes);
app.use(errorMiddleware);
app.use(express.urlencoded({ limit: "100mb", extended: true }));

AppDataSource.initialize().then(async () => {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
});
