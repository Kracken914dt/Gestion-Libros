import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { logger, stream } from "./config/logger";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import bookRoutes from "./modules/books/books.routes";
import authRoutes from "./modules/auth/auth.routes";
import { authService } from "./modules/auth/auth.service";

const app = express();

const normalizeOrigin = (origin: string): string => origin.replace(/\/$/, "");

const isOriginAllowed = (origin: string): boolean => {
  const normalizedOrigin = normalizeOrigin(origin);

  return env.CORS_ORIGINS.some((allowedOrigin) => {
    if (allowedOrigin.startsWith("*.")) {
      const domain = allowedOrigin.slice(1); // '.vercel.app'
      return normalizedOrigin.endsWith(domain);
    }
    return normalizedOrigin === allowedOrigin;
  });
};

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: false,
  }),
);

app.use(morgan("combined", { stream }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    await authService.ensureDefaultAdmin();

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
