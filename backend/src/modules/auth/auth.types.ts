import { Document } from "mongoose";

export interface IUser {
  email: string;
  passwordHash: string;
  role: "admin" | "user";
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface AuthPayload {
  sub: string;
  email: string;
  role: "admin" | "user";
}
