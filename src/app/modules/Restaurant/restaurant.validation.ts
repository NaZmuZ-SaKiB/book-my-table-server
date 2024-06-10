import { z } from "zod";

const createRestaurant = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .max(100, { message: "Name must be less than 100 characters" }),

  main_image: z
    .string({
      required_error: "Main image is required",
      invalid_type_error: "Main image must be a string",
    })
    .url({ message: "Main image must be a valid URL" }),

  images: z.array(
    z
      .string({
        required_error: "Images is required",
        invalid_type_error: "Images must be a string",
      })
      .url({ message: "Images must be a valid URL" })
  ),

  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),

  open_time: z.string({
    required_error: "Open time is required",
    invalid_type_error: "Open time must be a string",
  }),

  close_time: z.string({
    required_error: "Close time is required",
    invalid_type_error: "Close time must be a string",
  }),

  price: z.enum(["CHEAP", "REGULAR", "EXPENSIVE"], {
    required_error: "Price is required",
    invalid_type_error: "Price must be CHEAP, REGULAR or EXPENSIVE",
  }),

  tables: z.array(z.number()).length(2, {
    message: "Tables must be an array of two numbers",
  }),

  cuisine_id: z.number({
    required_error: "Cuisine is required",
    invalid_type_error: "Cuisine must be a number",
  }),

  location_id: z.number({
    required_error: "Location is required",
    invalid_type_error: "Location must be a number",
  }),
});

const updateRestaurant = createRestaurant
  .omit({
    tables: true,
  })
  .partial();

export const RestaurantValidation = {
  createRestaurant,
  updateRestaurant,
};
