"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
// Database configuration for SQL Server using environment variables
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getEnvVar(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`Missing required environment variable: ${name}`);
    return value;
}
exports.dbConfig = {
    user: getEnvVar('DB_USER'),
    password: getEnvVar('DB_PASSWORD'),
    server: getEnvVar('DB_SERVER'),
    database: getEnvVar('DB_DATABASE'),
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        instanceName: getEnvVar('DB_INSTANCE'),
    }
};
