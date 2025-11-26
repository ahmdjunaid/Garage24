import express from "express";
import { GarageController } from "../controllers/garage/implementation/garageController";
import { uploadOnboardingImages } from "../config/multerConfig";
import { verifyJWT } from "../middleware/jwt";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { MechanicController } from "../controllers/mechanic/implementation/mechanicController";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { PlanController } from "../controllers/plan/implimentation/planController";
import { hasActivePlan } from "../middleware/checkSubscription";


const router = express.Router()

const garageController = container.get<GarageController>(TYPES.GarageController)
const mechanicController = container.get<MechanicController>(TYPES.MechanicController)
const planController = container.get<PlanController>(TYPES.PlanController)

router.route('/onboarding').post(verifyJWT,authorizeRoles("garage"),uploadOnboardingImages,garageController.onboarding)
router.route('/get-address').get(verifyJWT,authorizeRoles("garage"),garageController.getAddressFromCoordinates)
router.route('/register-mechanic').post(verifyJWT,hasActivePlan,authorizeRoles("garage"),mechanicController.registerMechanic)
router.route('/resend-invitation/:mechanicId').post(verifyJWT,authorizeRoles("garage"),mechanicController.resendMechanicInvite)
router.route('/mechanics').get(verifyJWT,authorizeRoles("garage"),mechanicController.getAllMechanics)
router.route('/mechanic/:userId')
            .patch(verifyJWT,authorizeRoles("garage"),mechanicController.toggleStatus)
            .delete(verifyJWT,authorizeRoles("garage"),mechanicController.deleteMechanic)
router.route('/get-status').get(verifyJWT,authorizeRoles("garage"),garageController.getApprovalStatus)
router.route('/plans').get(verifyJWT,authorizeRoles("garage"),planController.getAllPlans)
router.route('/get-current-plan/:garageId').get(verifyJWT, garageController.getCurrentPlan)

export default router;