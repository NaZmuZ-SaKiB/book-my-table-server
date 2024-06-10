import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.user;

  const user = await AuthService.getUserById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User details fetched.",
    data: user,
  });
});

const signIn = catchAsync(async (req, res) => {
  const result = await AuthService.signIn(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully.",
    data: result,
  });
});

const signUp = catchAsync(async (req, res) => {
  const result = await AuthService.signUp(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Sign Up successful.",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await AuthService.updateUser(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update successful.",
    data: result,
  });
});

const updatePassword = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await AuthService.updatePassword(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password updated successfully.",
    data: result,
  });
});

const getNewToken = catchAsync(async (req, res) => {
  const { id } = req.user;
  const token = await AuthService.getNewToken(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token generated successfully.",
    data: token,
  });
});

export const AuthController = {
  getUserById,
  signIn,
  signUp,
  updateUser,
  updatePassword,
  getNewToken,
};
