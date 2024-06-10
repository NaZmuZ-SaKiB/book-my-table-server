import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { ROLE } from "@prisma/client";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

const generateToken = async (user: {
  email: string;
  role: ROLE;
  id: number;
}) => {
  const payload = {
    email: user.email,
    role: user.role,
    id: user.id,
  };
  const token = await jwt.sign(payload, config.jwt.token_secret as string, {
    expiresIn: config.jwt.token_expiration,
  });

  return token;
};

const verifyToken = async (token: string) => {
  try {
    const decoded = await jwt.verify(token, config.jwt.token_secret as string);

    return decoded as JwtPayload;
  } catch (err) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid token. Try login again."
    );
  }
};

export const JwtHelpers = {
  generateToken,
  verifyToken,
};
