import express from "express";
import { Authcontroller } from "../controllers/user/authController";
import { AuthRepository } from "../repositories/userRepositories";
import { AuthService } from "../services/authServices";
import { verifyResetJWT } from "../utils/jwt";

const router = express.Router();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new Authcontroller(authService);

router.route("/signup").post(authController.register);

router.route("/login").post(authController.login);

router.route("/verify-otp").post(authController.verifyOtp);

router.route("/resend-otp").post(authController.resendOtp);

router.route("/logout").post(authController.logout);

router.route('/forgot-password').post(authController.forgotPassword)

router.route('/reset-password').post(verifyResetJWT,authController.resetPassword)

router.route('/google/callback').post(authController.googleAuth)

export default router;
