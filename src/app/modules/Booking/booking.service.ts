import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../lib/prisma";
import { RestaurantService } from "../Restaurant/restaurant.service";
import { z } from "zod";
import { BookingValidation } from "./booking.validation";

const findMyBookings = async (id: number) => {
  const bookings = await prisma.booking.findMany({
    where: {
      booker_id: id,
    },
    orderBy: {
      booking_time: "desc",
    },
    include: {
      restaurant: true,
    },
  });

  return bookings;
};

const createBooking = async (
  slug: string,
  userId: number,
  query: { day: string; time: string; partySize: string },
  restaurantData: z.infer<typeof BookingValidation.createBooking>
) => {
  const { day, time, partySize } = query;

  if (!day || !time || !partySize) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please provide day, time and partysize."
    );
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      tables: true,
      open_time: true,
      close_time: true,
    },
  });
  if (!restaurant) {
    throw new AppError(httpStatus.NOT_FOUND, "Restaurant not found.");
  }

  if (
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Restaurant is not open at that time."
    );
  }

  const searchTimesWithTables = await RestaurantService.findAvailableTables({
    day,
    time,
    tables: restaurant.tables,
  });

  if (!searchTimesWithTables) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid time.");
  }

  const searchTimeWithTables = searchTimesWithTables.find(
    (t) => t.date.toISOString() === new Date(`${day}T${time}`).toISOString()
  );

  if (!searchTimeWithTables)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Can not book. Seats are booked at this time."
    );

  const tablesCount: {
    2: number[];
    4: number[];
  } = {
    2: [],
    4: [],
  };

  searchTimeWithTables.tables.forEach((table) => {
    if (table.seats === 2) tablesCount[2].push(table.id);
    else tablesCount[4].push(table.id);
  });

  const tablesToBook = [];
  let seatsRemaining = Number(partySize);

  while (seatsRemaining > 0) {
    if (seatsRemaining >= 3) {
      if (tablesCount[4].length) {
        tablesToBook.push({ id: tablesCount[4][0] });
        tablesCount[4].shift();
        seatsRemaining -= 4;
      } else {
        tablesToBook.push({ id: tablesCount[2][0] });
        tablesCount[2].shift();
        seatsRemaining -= 2;
      }
    } else {
      if (tablesCount[2].length) {
        tablesToBook.push({ id: tablesCount[2][0] });
        tablesCount[2].shift();
        seatsRemaining -= 2;
      } else {
        tablesToBook.push({ id: tablesCount[4][0] });
        tablesCount[4].shift();
        seatsRemaining -= 4;
      }
    }
  }

  const bookingData = {
    ...restaurantData,
    booker_id: userId,
    number_of_people: parseInt(partySize),
    booking_time: new Date(`${day}T${time}`),
    restaurant_id: restaurant.id,
    tables: {
      connect: tablesToBook,
    },
  };

  const booking = await prisma.booking.create({
    data: bookingData,
  });

  return booking;
};

const deleteBooking = async (userId: number, bookingId: number) => {
  const isBookingExists = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      booker_id: userId,
    },
  });

  if (!isBookingExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found.");
  }

  await prisma.booking.delete({
    where: { id: bookingId },
  });

  return null;
};

export const BookingService = {
  findMyBookings,
  createBooking,
  deleteBooking,
};
