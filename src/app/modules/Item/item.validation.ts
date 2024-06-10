import { z } from "zod";

const createItem = z.object({
  name: z.string({
    required_error: "Name is required.",
    invalid_type_error: "Name must be a string.",
  }),

  price: z.coerce
    .number({
      required_error: "Price is required.",
      invalid_type_error: "Price must be a number.",
    })
    .min(1, { message: "Price must be greater than 1." }),

  description: z.string({
    required_error: "Description is required.",
    invalid_type_error: "Description must be a string.",
  }),
});

export const ItemValidation = {
  createItem,
};
