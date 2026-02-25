import express from "express";
import { MechanicController } from "../controllers/mechanic/implementation/mechanicController";
import { verifyJWT } from "../middleware/jwt";
import { uploadProfile } from "../config/multerConfig";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { AppointmentController } from "../controllers/appointment/implementation/appointmentController";
import { DashboardController } from "../controllers/dashboard/implementation/dashboardController";


const router = express.Router()

const mechanicController = container.get<MechanicController>(TYPES.MechanicController);
const appointmentController = container.get<AppointmentController>(TYPES.AppointmentController);
const dashboardController = container.get<DashboardController>(TYPES.DashboardController)

router.route('/onboarding').post(verifyJWT,authorizeRoles("mechanic"),uploadProfile,mechanicController.onboarding);
router.route('/appointments').get(verifyJWT, authorizeRoles("mechanic"), appointmentController.getAllAppointmentByMechId)
router.route('/appointment/:appointmentId').get(verifyJWT, authorizeRoles("mechanic"), appointmentController.getAppointmentDetails)
router.route('/service-status').patch(verifyJWT, authorizeRoles("mechanic"), appointmentController.updateServiceStatus);

//Dashboard
router.route('/dashboard').get(verifyJWT, authorizeRoles("mechanic"), dashboardController.getMechanicDashboardData)

export default router;