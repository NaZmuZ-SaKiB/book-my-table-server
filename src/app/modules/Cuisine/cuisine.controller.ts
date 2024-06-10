import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CuisineService } from "./cuisine.service";

const getAllCuisine = catchAsync(async (req, res) => {
  const cuisine = await CuisineService.getAllCuisine();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cuisine fetched successfully.",
    data: cuisine,
  });
});

export const CuisineController = {
  getAllCuisine,
};
