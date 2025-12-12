import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();
// Login route
router.post("/login", AuthController.login);
// Create User (Admin only)
router.post("/create-user", [checkJwt, checkRole(["admin"])], AuthController.createUser);
// Me
router.get("/me", [checkJwt], AuthController.me);

export default router;
