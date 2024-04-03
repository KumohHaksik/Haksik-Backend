import {DataSource} from "typeorm";

const ApplicationContext = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
}).initialize()

export { ApplicationContext }