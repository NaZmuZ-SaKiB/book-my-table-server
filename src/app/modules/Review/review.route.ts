import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";
import { ReviewController } from "./review.controller";

const router = Router();

// POST
router.post(
  "/:slug",
  auth(),
  validateRequest(ReviewValidation.createReview),
  ReviewController.createReview
);

export const ReviewRoutes = router;
