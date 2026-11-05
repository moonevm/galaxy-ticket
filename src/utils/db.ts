import { Sequelize } from "sequelize-typescript";
import path from "path";
import type { Dialect } from "sequelize";

export const sequelize = new Sequelize({
    models: [path.join(__dirname, "../../models")],
    logging: false,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as Dialect,
})