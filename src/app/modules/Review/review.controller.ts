import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { slug } = req.params;

  const review = await ReviewService.createReview(slug, id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully.",
    data: review,
  });
});

export const ReviewController = {
  createReview,
};
