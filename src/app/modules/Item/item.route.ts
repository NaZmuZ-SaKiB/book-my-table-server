import { Router } from "express";
import auth from "../../middlewares/auth";
import { ROLE } from "@prisma/client";
import { ItemController } from "./item.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ItemValidation } from "./item.validation";

const router = Router();

// POST
router.post(
  "/:slug",
  auth(ROLE.OWNER),
  validateRequest(ItemValidation.createItem),
  ItemController.createItem
);

export const ItemRoutes = router;
