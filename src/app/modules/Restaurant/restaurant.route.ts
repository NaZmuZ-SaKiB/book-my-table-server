import { Router } from "express";
import { RestaurantController } from "./restaurant.controller";
import auth from "../../middlewares/auth";
import { ROLE } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { RestaurantValidation } from "./restaurant.validation";

const router = Router();

// GET
router.get("/", RestaurantController.getAllRestaurants);
router.get("/my", auth(ROLE.OWNER), RestaurantController.getMyRestaurants);
router.get("/:slug", RestaurantController.getRestaurantBySlug);
router.get("/:slug/availability", RestaurantController.fetchAvailabilities);

// POST
router.post(
  "/",
  auth(),
  validateRequest(RestaurantValidation.createRestaurant),
  RestaurantController.createRestaurant
);

// PATCH
router.patch(
  "/:slug",
  validateRequest(RestaurantValidation.updateRestaurant),
  auth(ROLE.OWNER),
  RestaurantController.updateRestaurant
);

export const RestaurantRoutes = router;
