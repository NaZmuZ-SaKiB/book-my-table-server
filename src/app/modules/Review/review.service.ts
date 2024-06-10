import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../lib/prisma";

const createReview = async (
  slug: string,
  userId: number,
  reviewData: { text: string; rating: number }
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, first_name: true, last_name: true },
  });

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!restaurant) {
    throw new AppError(httpStatus.NOT_FOUND, "Restaurant not found.");
  }

  const review = await prisma.review.create({
    data: {
      ...reviewData,
      first_name: user!.first_name,
      last_name: user!.last_name,
      restaurant_id: restaurant.id,
      user_id: user!.id,
    },
  });

  return review;
};

export const ReviewService = {
  createReview,
};
