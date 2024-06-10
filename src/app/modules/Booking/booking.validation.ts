import { z } from "zod";

const createBooking = z.object({
  booker_email: z
    .string({
      required_error: "Booker email is required",
      invalid_type_error: "Booker email must be a string",
    })
    .email({ message: "Invalid email" }),

  booker_first_name: z.string({
    required_error: "Booker first name is required",
    invalid_type_error: "Booker first name must be a string",
  }),

  booker_last_name: z.string({
    required_error: "Booker last name is required",
    invalid_type_error: "Booker last name must be a string",
  }),

  booker_phone: z.string({
    required_error: "Booker phone is required",
    invalid_type_error: "Booker phone must be a string",
  }),

  booker_occasion: z
    .string({
      invalid_type_error: "Booker occasion must be a string",
    })
    .optional(),

  booker_request: z
    .string({
      invalid_type_error: "Booker request must be a string",
    })
    .optional(),
});

export const BookingValidation = {
  createBooking,
};
