import { NextFunction, Request, Response } from "express";
import { createResponse } from "../../utils/response";
import { authService } from "./auth.service";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(createResponse(result, "Account created successfully"));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(createResponse(result, "Login successful"));
    } catch (error) {
      next(error);
    }
  }

  async listUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await authService.listManagedUsers();
      res.status(200).json(createResponse(users, "Users retrieved successfully"));
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.updateManagedUser(req.params.id, req.body);
      res.status(200).json(createResponse(user, "User updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.deleteManagedUser(req.params.id);
      res.status(200).json(createResponse(null, "User deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
