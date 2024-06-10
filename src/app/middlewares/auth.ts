import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { ROLE } from "@prisma/client";
import { JwtHelpers } from "../utils/jwtHelpers";
import prisma from "../lib/prisma";

const auth = (...requiredRoles: ROLE[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in.");
    }

    const decoded = await JwtHelpers.verifyToken(token);

    const isUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!isUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (
      requiredRoles &&
      requiredRoles.length > 0 &&
      !requiredRoles.includes(decoded.role)
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized.");
    }

    req.user = decoded;
    next();
  });
};

export default auth;
