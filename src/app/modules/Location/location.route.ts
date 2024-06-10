import { Router } from "express";
import { LocationController } from "./location.controller";

const router = Router();

// GET
router.get("/", LocationController.getAllLocations);

export const LocationRoutes = router;
