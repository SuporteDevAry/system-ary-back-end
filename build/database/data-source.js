"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDataSource = exports.AppDataSource = void 0;
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const migrations_1 = require("./migrations");
const entities_1 = require("../app/entities");
dotenv_1.default.config({ path: ".env" });
const SSL_VALUE = process.env.TYPEORM_SSL === "false" ? false : { rejectUnauthorized: false };
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: true,
    logging: false,
    entities: entities_1.entitiesDir,
    migrations: migrations_1.migrationDir,
    subscribers: [],
    ssl: SSL_VALUE,
    // Configurações para melhor resiliência
    connectTimeoutMS: 30000,
    maxQueryExecutionTime: 30000,
    extra: {
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        max: 20,
        min: 2, // Mínimo de conexões no pool
    },
});
// Função auxiliar para tentar inicializar com retry
async function initializeDataSource(maxRetries = 5, delayMs = 5000) {
    let lastError = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Tentando conectar ao banco de dados (tentativa ${attempt}/${maxRetries})...`);
            await exports.AppDataSource.initialize();
            console.log("✅ Conexão com banco de dados estabelecida com sucesso!");
            return true;
        }
        catch (error) {
            lastError = error;
            console.error(`❌ Falha na tentativa ${attempt}/${maxRetries}:`, error);
            if (attempt < maxRetries) {
                const waitTime = delayMs * attempt; // Backoff exponencial
                console.log(`⏳ Aguardando ${waitTime}ms antes da próxima tentativa...`);
                await new Promise((resolve) => setTimeout(resolve, waitTime));
            }
        }
    }
    console.error("❌ Não foi possível conectar ao banco de dados após todas as tentativas.");
    throw lastError;
}
exports.initializeDataSource = initializeDataSource;
//# sourceMappingURL=data-source.js.map