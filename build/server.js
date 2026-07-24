"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
require("reflect-metadata");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./database/data-source");
const routes_1 = __importDefault(require("./app/routes"));
//Error middleware fazer aqui para eliminar try catch no app
const error_1 = require("./app/middlewares/error");
// Seeds
const SeedProducts_1 = require("./database/seeds/SeedProducts");
const SeedProductsTables_1 = require("./database/seeds/SeedProductsTables");
const UpdateContractEmissionDatetime_1 = require("./database/seeds/UpdateContractEmissionDatetime");
const port = process.env.SERVER_PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "100mb" }));
app.use(routes_1.default);
app.use(error_1.errorMiddleware);
app.use(express_1.default.urlencoded({ limit: "100mb", extended: true }));
// AppDataSource.initialize().then(async () => {
//   app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
//   });
// });
(0, data_source_1.initializeDataSource)()
    .then(async () => {
    // Executa seeds apenas em ambiente de desenvolvimento
    if (process.env.NODE_ENV === "dev") {
        await (0, SeedProducts_1.seedProducts)(data_source_1.AppDataSource);
        await (0, SeedProductsTables_1.seedProductTables)(data_source_1.AppDataSource);
    }
    // Executa script de atualização apenas se habilitado via ENV
    if (process.env.RUN_UPDATE_CONTRACT_DATETIME === "true") {
        await (0, UpdateContractEmissionDatetime_1.updateContractEmissionDatetime)(data_source_1.AppDataSource);
        // Desativa a flag após executar (você pode remover manualmente do .env depois)
        console.log("⚠️  Script executado! Remova RUN_UPDATE_CONTRACT_DATETIME=true do .env para evitar execuções futuras.");
    }
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
})
    .catch((err) => {
    console.error("💥 Erro fatal ao inicializar AppDataSource:", err);
    console.error("🔄 O processo será encerrado. O container deve reiniciar automaticamente.");
    process.exit(1); // Força o container a reiniciar
});
//# sourceMappingURL=server.js.map