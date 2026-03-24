import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGODB_URI: string;
  CORS_ORIGINS: string[];
  LOG_LEVEL: string;
}

const getEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const env: EnvConfig = {
  PORT: parseInt(getEnvVar("PORT", "3000"), 10),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  MONGODB_URI: getEnvVar("MONGODB_URI", "mongodb://localhost:27017/book"),
  CORS_ORIGINS: getEnvVar("CORS_ORIGIN", "http://localhost:4200")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  LOG_LEVEL: getEnvVar("LOG_LEVEL", "info"),
};

export const isDevelopment = (): boolean => env.NODE_ENV === "development";
export const isProduction = (): boolean => env.NODE_ENV === "production";
