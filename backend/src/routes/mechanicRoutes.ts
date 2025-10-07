import express from "express";
import { AuthRepository } from "../repositories/userRepositories";
import { MechanicRepository } from "../repositories/mechanicRepositories";
import { MechanicService } from "../services/mechanicService";
import { MechanicController } from "../controllers/mechanic/mechanicController";
import { verifyJWT } from "../utils/jwt";


const router = express.Router()

const mechanicRepository = new MechanicRepository()
const authRepository = new AuthRepository()
const mechanicService = new MechanicService(mechanicRepository, authRepository)
const mechanicController = new MechanicController(mechanicService)

router.route('/register').post(verifyJWT,mechanicController.register)
router.route('/onboarding').post(verifyJWT,mechanicController.onboarding)

export default router;