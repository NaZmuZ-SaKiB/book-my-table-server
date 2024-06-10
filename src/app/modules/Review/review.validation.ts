import { z } from "zod";

const createReview = z.object({
  text: z.string({
    required_error: "Review text is required.",
    invalid_type_error: "Review text must be a string.",
  }),

  rating: z.number({
    required_error: "Rating is required.",
    invalid_type_error: "Rating must be a number.",
  }),
});

export const ReviewValidation = {
  createReview,
};
