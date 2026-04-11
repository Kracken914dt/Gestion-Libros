import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGODB_URI: string;
  CORS_ORIGINS: string[];
  LOG_LEVEL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
}

const getEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const normalizeOrigin = (origin: string): string => origin.replace(/\/$/, "");

export const env: EnvConfig = {
  PORT: parseInt(getEnvVar("PORT", "3000"), 10),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  MONGODB_URI: getEnvVar("MONGODB_URI", "mongodb://localhost:27017/book"),
  CORS_ORIGINS: getEnvVar(
    "CORS_ORIGIN",
    "http://localhost:5173,http://localhost:4200,http://localhost",
  )
    .split(",")
    .map((origin) => origin.trim())
    .map(normalizeOrigin)
    .filter(Boolean),
  LOG_LEVEL: getEnvVar("LOG_LEVEL", "info"),
  JWT_SECRET: getEnvVar("JWT_SECRET", "dev_jwt_secret_change_me"),
  JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", "8h"),
  ADMIN_EMAIL: getEnvVar("ADMIN_EMAIL", "admin@library.com").toLowerCase(),
  ADMIN_PASSWORD: getEnvVar("ADMIN_PASSWORD", "password123"),
};

export const isDevelopment = (): boolean => env.NODE_ENV === "development";
export const isProduction = (): boolean => env.NODE_ENV === "production";
