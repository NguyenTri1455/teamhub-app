import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true, // Auto create database schema. Don't use in production!
    logging: false,
    entities: ["src/entities/**/*.ts"],
    migrations: [],
    subscribers: [],
})
