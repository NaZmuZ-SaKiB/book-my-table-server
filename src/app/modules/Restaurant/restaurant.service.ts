import { Prisma, Table } from "@prisma/client";
import prisma from "../../lib/prisma";
import { restaurantSearchableFields } from "./restaurant.constant";
import {
  TPaginationOptions,
  paginationHelper,
} from "../../utils/paginationHelper";
import { z } from "zod";
import { RestaurantValidation } from "./restaurant.validation";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import slugify from "slug";
import { JwtPayload } from "jsonwebtoken";
import times from "../../data/time";

const getAllRestaurants = async (
  filters: Record<string, any>,
  options: TPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const andConditions: Prisma.RestaurantWhereInput[] = [];

  const { searchTerm, location, cuisine, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: [
        ...restaurantSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
        {
          location: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          cuisine: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  if (location) {
    andConditions.push({
      location: {
        name: {
          equals: location,
        },
      },
    });
  }

  if (cuisine) {
    andConditions.push({
      cuisine: {
        name: {
          equals: cuisine,
        },
      },
    });
  }

  const whereConditions: Prisma.RestaurantWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const restaurants = await prisma.restaurant.findMany({
    where: whereConditions,
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      main_image: true,
      price: true,
      slug: true,
      reviews: true,
      items: true,
      tables: true,
      location: true,
      cuisine: true,
      bookings: true,
    },
    orderBy: {
      updated_at: "desc",
    },
  });

  const total = await prisma.restaurant.count({
    where: whereConditions,
  });

  return {
    data: restaurants,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      reviews: true,
      items: true,
      tables: true,
      location: true,
      cuisine: true,
    },
  });
  return restaurant;
};

const createRestaurant = async (
  user: JwtPayload,
  payload: z.infer<typeof RestaurantValidation.createRestaurant>
) => {
  const { tables, ...restaurantData } = payload;

  // Validate Location ID
  const location = await prisma.location.findUnique({
    where: { id: payload.location_id },
    select: { id: true },
  });

  if (!location) {
    throw new AppError(httpStatus.NOT_FOUND, "Location not found.");
  }

  // Validate Cuisine ID
  const cuisine = await prisma.cuisine.findUnique({
    where: { id: payload.cuisine_id },
    select: { id: true },
  });

  if (!cuisine) {
    throw new AppError(httpStatus.NOT_FOUND, "Cuisine not found.");
  }

  const slug = slugify(`${payload.name} ${Date.now()}`);

  const result = await prisma.$transaction(async (transactionClient) => {
    const restaurant = await transactionClient.restaurant.create({
      data: {
        ...restaurantData,
        owner_id: user.id,
        slug,
      },
    });

    const tablesData = [];
    for (let i = 0; i < tables[0]; i++) {
      tablesData.push({
        seats: 4,
        restaurant_id: restaurant.id,
      });
    }
    for (let i = 0; i < tables[1]; i++) {
      tablesData.push({
        seats: 2,
        restaurant_id: restaurant.id,
      });
    }

    if (tablesData.length > 0) {
      await transactionClient.table.createMany({
        data: tablesData,
      });
    }

    if (user.role === "USER") {
      await transactionClient.user.update({
        where: { id: user.id },
        data: {
          role: "OWNER",
        },
      });
    }

    return restaurant;
  });

  return result;
};

const updateRestaurant = async (
  slug: string,
  payload: z.infer<typeof RestaurantValidation.updateRestaurant>
) => {
  const restaurant = await prisma.restaurant.update({
    where: { slug },
    data: { ...payload },
  });

  return restaurant;
};

const getMyRestaurants = async (userId: number) => {
  const restaurants = await prisma.restaurant.findMany({
    where: { owner_id: userId },
    include: {
      reviews: true,
      items: true,
      tables: true,
      location: true,
      cuisine: true,
      bookings: true,
    },
  });

  return restaurants;
};

const fetchAvailabilities = async (
  slug: string,
  query: { day: string; time: string; partySize: string }
) => {
  const { day, time, partySize } = query;

  if (!day || !time || !partySize) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid query parameters.");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    throw new AppError(httpStatus.NOT_FOUND, "Restaurant not found.");
  }

  const searchTimesWithTables = await findAvailableTables({
    day,
    time,
    tables: restaurant.tables,
  });

  if (!searchTimesWithTables) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid time.");
  }

  // Checking time is available or not
  const availabilities = searchTimesWithTables
    .map((t) => {
      const sumSeats = t.tables.reduce((sum, table) => sum + table.seats, 0);
      return {
        time: t.time,
        available: sumSeats >= parseInt(partySize),
      };
    })
    .filter((availability) => {
      const timeIsAfterOpeningHour =
        new Date(`${day}T${availability.time}`) >=
        new Date(`${day}T${restaurant.open_time}`);
      const timeIsBeforeClosingHour =
        new Date(`${day}T${availability.time}`) <=
        new Date(`${day}T${restaurant.close_time}`);

      return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
    });

  return availabilities;
};

const findAvailableTables = async ({
  day,
  time,
  tables,
}: {
  day: string;
  time: string;
  tables: Table[];
}) => {
  // Extracting SearchTimes according to the Time Query
  const searchTimes = times.find((t) => t.time === time)?.searchTimes; // Array[]

  if (!searchTimes) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid time.");
  }

  // Getting The Bookings of the SearchTimes if available
  const bookings = await prisma.booking.findMany({
    // return Array[]
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const bookingTablesObj: { [key: string]: { [key: number]: boolean } } = {};
  // bookingTablesObj = {
  //    "14:00:00.000Z": {
  //      1: true,      (here 1 is table id)
  //      3: true,      (here 3 is table id)
  //    }
  // }
  bookings.forEach((booking) => {
    bookingTablesObj[booking.booking_time.toISOString()] =
      booking.tables.reduce((obj, table) => {
        return {
          ...obj,
          [table.id]: true,
        };
      }, {});
  });

  //  searchTimesWithTables = [{
  //    date: Given Date and EachSearchTime = Ex:2023-04-25T16:00:00.000Z,
  //    time: EachSearchTime = Ex:16:00:00.000Z,
  //    tables: Array of all the table objects in the restaurant = [{id,seats,...},...]
  //  }]
  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  // Filtering the tables which is booked
  searchTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookingTablesObj[t.date.toISOString()]) {
        if (bookingTablesObj[t.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  return searchTimesWithTables;
};

export const RestaurantService = {
  getAllRestaurants,
  getRestaurantBySlug,
  createRestaurant,
  updateRestaurant,
  getMyRestaurants,
  fetchAvailabilities,
  findAvailableTables,
};
