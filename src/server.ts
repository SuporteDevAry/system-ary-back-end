import "express-async-errors";
import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./database/data-source";
import routes from "./app/routes";

//Error middleware fazer aqui para eliminar try catch no app
import { errorMiddleware } from "./app/middlewares/error";

// Seeds
import { seedProducts } from "./database/seeds/SeedProducts";
import { seedProductTables } from "./database/seeds/SeedProductsTables";
import { updateContractEmissionDatetime } from "./database/seeds/UpdateContractEmissionDatetime";

const port = process.env.SERVER_PORT;
const app = express();

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(routes);
app.use(errorMiddleware);
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// AppDataSource.initialize().then(async () => {
//   app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
//   });
// });

AppDataSource.initialize()
  .then(async () => {
    // Executa seeds apenas em ambiente de desenvolvimento
    if (process.env.NODE_ENV === "dev") {
      await seedProducts(AppDataSource);
      await seedProductTables(AppDataSource);
    }

    // Executa script de atualização apenas se habilitado via ENV
    if (process.env.RUN_UPDATE_CONTRACT_DATETIME === "true") {
      await updateContractEmissionDatetime(AppDataSource);
      // Desativa a flag após executar (você pode remover manualmente do .env depois)
      console.log(
        "⚠️  Script executado! Remova RUN_UPDATE_CONTRACT_DATETIME=true do .env para evitar execuções futuras."
      );
    }

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao inicializar AppDataSource:", err);
  });
