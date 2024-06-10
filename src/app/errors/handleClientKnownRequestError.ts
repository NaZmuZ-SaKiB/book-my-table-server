import { Prisma } from "@prisma/client";

const handleClientKnownRequestError = (
  error: Prisma.PrismaClientKnownRequestError
) => {
  let message = "";
  const statusCode = 400;

  if (error.code === "P2025") {
    message = (error.meta?.cause as string) || "Record not found!";
  } else if (error.code === "P2003") {
    if (error.message.includes("delete()` invocation:")) {
      message = "Delete failed";
    }
  }

  return {
    statusCode,
    message,
  };
};

export default handleClientKnownRequestError;
