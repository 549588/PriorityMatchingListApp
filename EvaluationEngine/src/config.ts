// Database configuration for SQL Server using environment variables
import dotenv from 'dotenv';
dotenv.config();

function getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
}

export const dbConfig = {
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
