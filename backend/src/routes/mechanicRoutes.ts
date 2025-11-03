import express from "express";
import { AuthRepository } from "../repositories/user/implementation/userRepositories";
import { MechanicRepository } from "../repositories/mechanic/implementation/mechanicRepositories";
import { MechanicService } from "../services/mechanic/implementation/mechanicService";
import { MechanicController } from "../controllers/mechanic/implementation/mechanicController";
import { verifyJWT } from "../middleware/jwt";
import { uploadImage } from "../config/multerConfig";
import { authorizeRoles } from "../middleware/authorizeRoles";


const router = express.Router()


const mechanicRepository = new MechanicRepository()
const authRepository = new AuthRepository()
const mechanicService = new MechanicService(mechanicRepository, authRepository)
const mechanicController = new MechanicController(mechanicService)

router.route('/onboarding').post(verifyJWT,authorizeRoles("mechanic"),uploadImage,mechanicController.onboarding)

export default router;