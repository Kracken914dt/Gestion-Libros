import mongoose, { Schema } from "mongoose";
import { IUserDocument } from "./auth.types";

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete (ret as any)._id;
        delete (ret as any).__v;
        delete (ret as any).passwordHash;
        return ret;
      },
    },
  },
);

export const User = mongoose.model<IUserDocument>("User", userSchema);
