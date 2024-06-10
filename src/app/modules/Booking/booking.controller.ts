import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";

const findMyBookings = catchAsync(async (req, res) => {
  const { id } = req.user;
  const bookings = await BookingService.findMyBookings(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings fetched successfully",
    data: bookings,
  });
});

const createBooking = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { slug } = req.params;

  const booking = await BookingService.createBooking(
    slug,
    id,
    req.query as any,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

const deleteBooking = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { bookingId } = req.params;

  const result = await BookingService.deleteBooking(id, Number(bookingId));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking deleted successfully",
    data: result,
  });
});

export const BookingController = {
  findMyBookings,
  createBooking,
  deleteBooking,
};
