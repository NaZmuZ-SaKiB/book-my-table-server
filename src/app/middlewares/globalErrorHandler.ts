import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import config from "../config";
import handleValidationError from "../errors/handleValidationError";
import { Prisma } from "@prisma/client";
import handleClientKnownRequestError from "../errors/handleClientKnownRequestError";
import AppError from "../errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode: number = 500;
  let message: string = "Internal server error.";

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handleClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err?.message || message;
  }

  // Ultimate Return
  return res.status(statusCode).json({
    success: false,
    message,
    stack: config.node_env === "development" ? err?.stack : null,
    error: err,
  });
};

export default globalErrorHandler;
