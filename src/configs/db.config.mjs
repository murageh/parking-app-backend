import "dotenv/config";
// import cKey from 'raw-loader!certs/cacert.pem';
import * as fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const env = process.env;

export default {
    HOST: env.DB_HOST,
    USER: env.DB_USER,
    PASSWORD: env.DB_PASSWORD,
    DB: env.DB_DATABASE,
    dialect: "postgres",
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 20000
    }
};