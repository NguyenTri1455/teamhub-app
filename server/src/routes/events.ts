import { Router } from "express";
import EventController from "../controllers/EventController";
import { checkJwt } from "../middlewares/checkJwt";

import { checkRole } from "../middlewares/checkRole";

const router = Router();

// Get all events
router.get("/", [checkJwt], EventController.list);

// Create a new event
router.post("/", [checkJwt, checkRole(["admin"])], EventController.create);

// Update
router.patch("/:id", [checkJwt, checkRole(["admin"])], EventController.update);

// Delete
router.delete("/:id", [checkJwt, checkRole(["admin"])], EventController.delete);

export default router;
