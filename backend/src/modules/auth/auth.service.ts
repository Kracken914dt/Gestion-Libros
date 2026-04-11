import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../middlewares/errorHandler";
import { User } from "./auth.model";
import { AuthPayload, LoginInput, RegisterInput } from "./auth.types";

type AuthResult = { token: string; user: { id: string; email: string; role: "admin" | "user" } };

class AuthService {
  async ensureDefaultAdmin(): Promise<void> {
    const existingAdmin = await User.findOne({ email: env.ADMIN_EMAIL }).exec();
    if (existingAdmin) {
      return;
    }

    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
    await User.create({
      email: env.ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    });
  }

  async register(input: RegisterInput): Promise<AuthResult> {
    const email = input.email.toLowerCase();
    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      throw new AppError(409, "Email is already registered");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await User.create({
      email,
      passwordHash,
      role: "user",
    });

    return this.buildAuthResponse(user.id, user.email, user.role);
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const email = input.email.toLowerCase();
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError(401, "Invalid credentials");
    }

    return this.buildAuthResponse(user.id, user.email, user.role);
  }

  private buildAuthResponse(id: string, email: string, role: "admin" | "user"): AuthResult {
    const payload: AuthPayload = {
      sub: id,
      email,
      role,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    return {
      token,
      user: {
        id,
        email,
        role,
      },
    };
  }
}

export const authService = new AuthService();
