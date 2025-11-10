import express from "express";
import { GarageController } from "../controllers/garage/implementation/garageController";
import { GarageRepository } from "../repositories/garage/implementation/garageRepositories";
import { GarageService } from "../services/garage/implementation/garageServices";
import { AuthRepository } from "../repositories/user/implementation/userRepositories";
import { uploadOnboardingImages } from "../config/multerConfig";
import { verifyJWT } from "../middleware/jwt";
import { MechanicRepository } from "../repositories/mechanic/implementation/mechanicRepositories";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { AdminRepository } from "../repositories/superAdmin/implementation/adminRepositories";
import User from "../models/user";
import { Garage } from "../models/garage";
import { Plan } from "../models/plan";


const router = express.Router()

const garageRepository = new GarageRepository()
const authRepository = new AuthRepository()
const mechanicRepository = new MechanicRepository()
const adminRepository = new AdminRepository(User, Garage, Plan)
const garageService = new GarageService(garageRepository, authRepository, mechanicRepository, adminRepository)
const garageController = new GarageController(garageService)

router.route('/onboarding').post(verifyJWT,authorizeRoles("garage"),uploadOnboardingImages,garageController.onboarding)
router.route('/get-address').get(verifyJWT,authorizeRoles("garage"),garageController.getAddressFromCoordinates)
router.route('/register-mechanic').post(verifyJWT,authorizeRoles("garage"),garageController.registerMechanic)
router.route('/mechanics').get(verifyJWT,authorizeRoles("garage"),garageController.getAllMechanics)
router.route('/mechanic/:userId')
            .patch(verifyJWT,authorizeRoles("garage"),garageController.toggleStatus)
            .delete(verifyJWT,authorizeRoles("garage"),garageController.deleteMechanic)
router.route('/get-status').get(verifyJWT,authorizeRoles("garage"),garageController.getApprovalStatus)

export default router;