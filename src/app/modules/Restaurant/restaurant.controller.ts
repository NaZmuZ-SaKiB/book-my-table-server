import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RestaurantService } from "./restaurant.service";
import pick from "../../utils/pick";
import { restaurantFilterableFields } from "./restaurant.constant";

const getAllRestaurants = catchAsync(async (req, res) => {
  const filters = pick(req.query, restaurantFilterableFields);
  const options = pick(req.query, ["page", "limit"]);

  const result = await RestaurantService.getAllRestaurants(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Restaurants fetched successfully.",
    data: result.data,
    meta: result.meta,
  });
});

const getRestaurantBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const restaurant = await RestaurantService.getRestaurantBySlug(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Restaurant fetched successfully.",
    data: restaurant,
  });
});

const createRestaurant = catchAsync(async (req, res) => {
  const user = req.user;

  const restaurant = await RestaurantService.createRestaurant(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Restaurant created successfully.",
    data: restaurant,
  });
});

const updateRestaurant = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const restaurant = await RestaurantService.updateRestaurant(slug, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Restaurant updated successfully.",
    data: restaurant,
  });
});

const getMyRestaurants = catchAsync(async (req, res) => {
  const { id } = req.user;

  const restaurants = await RestaurantService.getMyRestaurants(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Restaurants fetched successfully.",
    data: restaurants,
  });
});

const fetchAvailabilities = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const availabilities = await RestaurantService.fetchAvailabilities(
    slug,
    req.query as any
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Availabilities fetched successfully.",
    data: availabilities,
  });
});

export const RestaurantController = {
  getAllRestaurants,
  getRestaurantBySlug,
  createRestaurant,
  updateRestaurant,
  getMyRestaurants,
  fetchAvailabilities,
};
