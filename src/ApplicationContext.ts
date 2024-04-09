import { DataSource } from "typeorm"
import 'reflect-metadata';
import { Menu } from "./entitys/Menu";

const ApplicationContext = new DataSource({
    type: "mssql",
    host: process.env["DB_HOST"],
    port: 1433,
    username: process.env["DB_USER"],
    password: process.env["DB_PASSWORD"],
    database: process.env["DB_NAME"],
    synchronize: false,
    logging: true,
    entities: [
        Menu
    ],
    subscribers: [],
    migrations: [],
}).initialize()


export {
    ApplicationContext
}