import { Router } from "express";
import { validate } from "../../middlewares/validator";
import { authController } from "./auth.controller";
import { loginValidation, registerValidation } from "./auth.validation";

const router = Router();

router.post("/register", validate(registerValidation), authController.register);
router.post("/login", validate(loginValidation), authController.login);

export default router;
