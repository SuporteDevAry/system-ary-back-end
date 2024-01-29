import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { migrationDir } from "./migrations";
import { entitiesDir } from "../app/entities";

dotenv.config({ path: ".env" });

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
  ssl: {
    rejectUnauthorized: false,
  },
});
