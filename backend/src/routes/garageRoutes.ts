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
import { MechanicService } from "../services/mechanic/implementation/mechanicService";
import { MechanicController } from "../controllers/mechanic/implementation/mechanicController";


const router = express.Router()

const garageRepository = new GarageRepository()
const authRepository = new AuthRepository()
const adminRepository = new AdminRepository(User, Garage, Plan)
const garageService = new GarageService(garageRepository, authRepository, adminRepository)
const garageController = new GarageController(garageService)

const mechanicRepository = new MechanicRepository()
const mechanicService = new MechanicService(mechanicRepository, authRepository)
const mechanicController = new MechanicController(mechanicService)

router.route('/onboarding').post(verifyJWT,authorizeRoles("garage"),uploadOnboardingImages,garageController.onboarding)
router.route('/get-address').get(verifyJWT,authorizeRoles("garage"),garageController.getAddressFromCoordinates)
router.route('/register-mechanic').post(verifyJWT,authorizeRoles("garage"),mechanicController.registerMechanic)
router.route('/resend-invitation/:mechanicId').post(verifyJWT,authorizeRoles("garage"),mechanicController.resendMechanicInvite)
router.route('/mechanics').get(verifyJWT,authorizeRoles("garage"),mechanicController.getAllMechanics)
router.route('/mechanic/:userId')
            .patch(verifyJWT,authorizeRoles("garage"),mechanicController.toggleStatus)
            .delete(verifyJWT,authorizeRoles("garage"),mechanicController.deleteMechanic)
router.route('/get-status').get(verifyJWT,authorizeRoles("garage"),garageController.getApprovalStatus)
router.route('/plans').get(verifyJWT,authorizeRoles("garage"),garageController.getAllPlans)
router.route('/create-checkout-session').post(garageController.createCheckoutSession)

export default router;