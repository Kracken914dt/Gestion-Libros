import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./errorHandler";

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    email: string;
    role: "admin" | "user";
  };
}

export const authenticateToken = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication token is required"));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      sub: string;
      email: string;
      role: "admin" | "user";
    };

    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
};

export const requireRole = (allowedRole: "admin") => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      next(new AppError(401, "Authentication token is required"));
      return;
    }

    if (user.role !== allowedRole) {
      next(new AppError(403, "You do not have permission to perform this action"));
      return;
    }

    next();
  };
};
