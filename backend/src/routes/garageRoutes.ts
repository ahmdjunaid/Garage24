import express from "express";
import { GarageController } from "../controllers/garage/implementation/garageController";
import { GarageRepository } from "../repositories/garage/implementation/garageRepositories";
import { GarageService } from "../services/garage/implementation/garageServices";
import { AuthRepository } from "../repositories/user/implementation/userRepositories";
import { uploadImage } from "../config/multerConfig";
import { verifyJWT } from "../middleware/jwt";
import { MechanicRepository } from "../repositories/mechanic/implementation/mechanicRepositories";
import { authorizeRoles } from "../middleware/authorizeRoles";


const router = express.Router()

const garageRepository = new GarageRepository()
const authRepository = new AuthRepository()
const mechanicRepository = new MechanicRepository()
const garageService = new GarageService(garageRepository, authRepository, mechanicRepository)
const garageController = new GarageController(garageService)

router.route('/onboarding').post(verifyJWT,authorizeRoles("garage"),uploadImage,garageController.onboarding)
router.route('/get-address').get(verifyJWT,authorizeRoles("garage"),garageController.getAddressFromCoordinates)
router.route('/register-mechanic').post(verifyJWT,authorizeRoles("garage"),garageController.registerMechanic)
router.route('/mechanics').get(verifyJWT,authorizeRoles("garage"),garageController.getAllMechanics)
router.route('/mechanic/:userId')
            .patch(verifyJWT,authorizeRoles("garage"),garageController.toggleStatus)
            .delete(verifyJWT,authorizeRoles("garage"),garageController.deleteMechanic)

export default router;