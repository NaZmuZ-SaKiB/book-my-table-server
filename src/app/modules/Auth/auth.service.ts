import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../lib/prisma";
import comparePassword from "../../utils/comparePassword";
import { JwtHelpers } from "../../utils/jwtHelpers";
import { z } from "zod";
import { AuthValidation } from "./auth.validation";

const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found.");

  // removing password field from user object
  const { password, ...userData } = user;

  return userData;
};

const signIn = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found.");

  const checkPassword = await comparePassword(payload.password, user.password);
  if (!checkPassword)
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password.");

  const { password, ...userData } = user;

  const token = await JwtHelpers.generateToken(user);

  return { token, user: userData };
};

const signUp = async (payload: z.infer<typeof AuthValidation.signUp>) => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const user = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });

  const { password, ...userData } = user;

  const token = await JwtHelpers.generateToken(user);

  return {
    token,
    user: userData,
  };
};

const updateUser = async (
  id: number,
  payload: z.infer<typeof AuthValidation.updateUser>
) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!isUserExist) throw new AppError(httpStatus.NOT_FOUND, "User not found.");

  const user = await prisma.user.update({
    where: { id },
    data: { ...payload },
  });

  const { password, ...userData } = user;

  return userData;
};

const updatePassword = async (
  id: number,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { password: true },
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found.");

  const checkPassword = await comparePassword(
    payload.oldPassword,
    user.password
  );
  if (!checkPassword)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid Old Password. If you forgot your password, please reset it."
    );

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  return;
};

const getNewToken = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found.");

  const token = await JwtHelpers.generateToken(user);

  return token;
};

export const AuthService = {
  getUserById,
  signIn,
  signUp,
  updateUser,
  updatePassword,
  getNewToken,
};
