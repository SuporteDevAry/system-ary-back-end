import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { migrationDir } from "./migrations";
import { entitiesDir } from "../app/entities";

dotenv.config({ path: ".env" });

const SSL_VALUE =
  process.env.TYPEORM_SSL === "false" ? false : { rejectUnauthorized: false };

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: true,
  logging: false,
  entities: entitiesDir,
  migrations: migrationDir,
  subscribers: [],
  ssl: SSL_VALUE,
  // Configurações para melhor resiliência
  connectTimeoutMS: 30000,
  maxQueryExecutionTime: 30000,
  extra: {
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 20, // Máximo de conexões no pool
    min: 2, // Mínimo de conexões no pool
  },
});

// Função auxiliar para tentar inicializar com retry
export async function initializeDataSource(maxRetries = 5, delayMs = 5000) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `Tentando conectar ao banco de dados (tentativa ${attempt}/${maxRetries})...`
      );
      await AppDataSource.initialize();
      console.log("✅ Conexão com banco de dados estabelecida com sucesso!");
      return true;
    } catch (error) {
      lastError = error as Error;
      console.error(`❌ Falha na tentativa ${attempt}/${maxRetries}:`, error);

      if (attempt < maxRetries) {
        const waitTime = delayMs * attempt; // Backoff exponencial
        console.log(
          `⏳ Aguardando ${waitTime}ms antes da próxima tentativa...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error(
    "❌ Não foi possível conectar ao banco de dados após todas as tentativas."
  );
  throw lastError;
}
