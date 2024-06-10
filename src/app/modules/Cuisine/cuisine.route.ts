import { Router } from "express";
import { CuisineController } from "./cuisine.controller";

const router = Router();

// GET
router.get("/", CuisineController.getAllCuisine);

export const CuisineRoutes = router;
