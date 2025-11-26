import express from "express";
import { MechanicController } from "../controllers/mechanic/implementation/mechanicController";
import { verifyJWT } from "../middleware/jwt";
import { uploadProfile } from "../config/multerConfig";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";


const router = express.Router()

const mechanicController = container.get<MechanicController>(TYPES.MechanicController)

router.route('/onboarding').post(verifyJWT,authorizeRoles("mechanic"),uploadProfile,mechanicController.onboarding)

export default router;