import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const registerValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
