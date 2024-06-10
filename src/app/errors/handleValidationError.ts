import { Prisma } from "@prisma/client";
import { TGenericErrorResponse } from "../interface/error.interface";

const handleValidationError = (
  error: Prisma.PrismaClientValidationError
): TGenericErrorResponse => {
  const statusCode = 400;
  return {
    statusCode,
    message: error.message,
  };
};

export default handleValidationError;
