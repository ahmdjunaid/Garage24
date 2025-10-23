import express from "express";
import { GarageController } from "../controllers/garage/implementation/garageController";
import { GarageRepository } from "../repositories/garage/implementation/garageRepositories";
import { GarageService } from "../services/garage/implementation/garageServices";
import { AuthRepository } from "../repositories/user/implementation/userRepositories";
import { uploadImage } from "../config/multerConfig";
import { verifyJWT } from "../middleware/jwt";
import { MechanicRepository } from "../repositories/mechanic/implementation/mechanicRepositories";


const router = express.Router()

const garageRepository = new GarageRepository()
const authRepository = new AuthRepository()
const mechanicRepository = new MechanicRepository()
const garageService = new GarageService(garageRepository, authRepository, mechanicRepository)
const garageController = new GarageController(garageService)

router.route('/onboarding').post(uploadImage,garageController.onboarding)
router.route('/get-address').get(verifyJWT,garageController.getAddressFromCoordinates)
router.route('/mechanics').get(verifyJWT,garageController.getAllMechanics)
router.route('/mechanic/:userId')
            .patch(verifyJWT,garageController.toggleStatus)
            .delete(verifyJWT,garageController.deleteMechanic)

export default router;