import express from "express";
import { Authcontroller } from "../controllers/auth/implementation/authController";
import { verifyJWT, verifyResetJWT } from "../middleware/jwt";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { uploadProfile } from "../config/multerConfig";

const router = express.Router();

const authController = container.get<Authcontroller>(TYPES.AuthController);

router.route("/signup").post(authController.register);
router.route("/login").post(authController.login);
router.route("/verify-otp").post(authController.verifyOtp);
router.route("/resend-otp").post(authController.resendOtp);
router.route("/logout").post(authController.logout);
router.route("/forgot-password").post(authController.forgotPassword);
router
  .route("/reset-password")
  .post(verifyResetJWT, authController.resetPassword);
router.route("/google/callback").post(authController.googleAuth);
router.route("/refresh-token").post(authController.refreshToken);
router.route("/me").get(verifyJWT, authController.getUserDataById);
router.route("/profile").post(verifyJWT,uploadProfile,authController.updateProfileData)
router.route("/change-password").post(verifyJWT, authController.changePassword)

export default router;
