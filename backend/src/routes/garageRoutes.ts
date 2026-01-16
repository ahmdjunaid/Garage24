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
import { ServiceController } from "../controllers/service/implementation/serviceController";
import { ServiceCategoryController } from "../controllers/serviceCategory/implementation/serviceCategoryController";
import { LocationController } from "../controllers/location/implementation/locationController";
import { AppointmentController } from "../controllers/appointment/implementation/appointmentController";


const router = express.Router()

const garageController = container.get<GarageController>(TYPES.GarageController)
const mechanicController = container.get<MechanicController>(TYPES.MechanicController)
const planController = container.get<PlanController>(TYPES.PlanController)
const serviceController = container.get<ServiceController>(TYPES.ServiceController)
const serviceCategoryController = container.get<ServiceCategoryController>(TYPES.ServiceCategoryController)
const locationController = container.get<LocationController>(TYPES.LocationController)
const appointmentController = container.get<AppointmentController>(TYPES.AppointmentController)

router.route('/onboarding').post(verifyJWT,authorizeRoles("garage"),uploadOnboardingImages,garageController.onboarding)
router.route('/get-address').get(verifyJWT,authorizeRoles("garage"),locationController.getAddressFromCoordinates)
router.route('/register-mechanic').post(verifyJWT,hasActivePlan,authorizeRoles("garage"),mechanicController.registerMechanic)
router.route('/resend-invitation/:mechanicId').post(verifyJWT,authorizeRoles("garage"),mechanicController.resendMechanicInvite)
router.route('/mechanics').get(verifyJWT,authorizeRoles("garage"),mechanicController.getAllMechanics)
router.route('/mechanic/:userId')
            .patch(verifyJWT,authorizeRoles("garage"),mechanicController.toggleStatus)
            .delete(verifyJWT,authorizeRoles("garage"),mechanicController.deleteMechanic)
router.route('/get-status').get(verifyJWT,authorizeRoles("garage"),garageController.getApprovalStatus)
router.route('/plans').get(verifyJWT,authorizeRoles("garage"),planController.getAllPlans)
router.route('/get-current-plan/:garageId').get(verifyJWT,authorizeRoles("garage"),garageController.getCurrentPlan)
router.route('/services').post(verifyJWT,hasActivePlan,authorizeRoles("garage"),serviceController.createService)
router.route('/services').get(verifyJWT,authorizeRoles("garage"),serviceController.getAllServices)
router.route('/services/:serviceId').patch(verifyJWT,authorizeRoles("garage"),serviceController.toggleStatus)
router.route('/services/:serviceId').delete(verifyJWT,authorizeRoles("garage"),serviceController.deleteService)
router.route('/get-garage').get(verifyJWT,authorizeRoles("garage"),garageController.getGarageById)
router.route('/service-categories').get(verifyJWT, authorizeRoles("garage"), serviceCategoryController.getAllServiceCategories)
router.route("/appointments").get(verifyJWT, authorizeRoles("garage"), appointmentController.getActiveAppointments)

export default router;