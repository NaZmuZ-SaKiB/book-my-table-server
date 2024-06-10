import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { LocationService } from "./location.service";

const getAllLocations = catchAsync(async (req, res) => {
  const location = await LocationService.getAllLocations();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Locations fetched successfully.",
    data: location,
  });
});

export const LocationController = {
  getAllLocations,
};
