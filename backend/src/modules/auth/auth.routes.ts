import { Router } from "express";
import { validate } from "../../middlewares/validator";
import { authenticateToken, requireRole } from "../../middlewares/auth";
import { authController } from "./auth.controller";
import { adminUpdateUserValidation, loginValidation, registerValidation, userIdValidation } from "./auth.validation";

const router = Router();

router.post("/register", validate(registerValidation), authController.register);
router.post("/login", validate(loginValidation), authController.login);

router.use(authenticateToken);
router.use(requireRole("admin"));

router.get("/users", authController.listUsers);
router.put("/users/:id", validate(adminUpdateUserValidation), authController.updateUser);
router.delete("/users/:id", validate(userIdValidation), authController.deleteUser);

export default router;
