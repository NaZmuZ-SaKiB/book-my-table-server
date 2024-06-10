import { Router } from "express";
import auth from "../../middlewares/auth";
import { BookingController } from "./booking.controller";
import validateRequest from "../../middlewares/validateRequest";
import { BookingValidation } from "./booking.validation";

const router = Router();

// GET
router.get("/my", auth(), BookingController.findMyBookings);

// POST
router.post(
  "/:slug",
  auth(),
  validateRequest(BookingValidation.createBooking),
  BookingController.createBooking
);

// DELETE
router.delete("/:bookingId", auth(), BookingController.deleteBooking);

export const BookingRoutes = router;
