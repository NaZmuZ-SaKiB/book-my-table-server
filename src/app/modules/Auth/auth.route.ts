import { Router } from "express";
import auth from "../../middlewares/auth";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = Router();

// GET
router.get("/me", auth(), AuthController.getUserById);
router.get("/new-token", auth(), AuthController.getNewToken);

// POST
router.post(
  "/signin",
  validateRequest(AuthValidation.signIn),
  AuthController.signIn
);

router.post(
  "/signup",
  validateRequest(AuthValidation.signUp),
  AuthController.signUp
);

// PATCH
router.patch(
  "/me",
  auth(),
  validateRequest(AuthValidation.updateUser),
  AuthController.updateUser
);

router.patch(
  "/password",
  auth(),
  validateRequest(AuthValidation.updatePassword),
  AuthController.updatePassword
);

export const AuthRoutes = router;
