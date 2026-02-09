import express from "express";
import { MechanicController } from "../controllers/mechanic/implementation/mechanicController";
import { verifyJWT } from "../middleware/jwt";
import { uploadProfile } from "../config/multerConfig";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { AppointmentController } from "../controllers/appointment/implementation/appointmentController";


const router = express.Router()

const mechanicController = container.get<MechanicController>(TYPES.MechanicController);
const appointmentController = container.get<AppointmentController>(TYPES.AppointmentController);

router.route('/onboarding').post(verifyJWT,authorizeRoles("mechanic"),uploadProfile,mechanicController.onboarding);
router.route('/appointments').get(verifyJWT, authorizeRoles("mechanic"), appointmentController.getAllAppointmentByMechId)
// router.route('/appointments').get((req,res)=>{
//     console.log(req.query)
// })
router.route('/appointment/:appointmentId').get(verifyJWT, authorizeRoles("mechanic"), appointmentController.getAppointmentDetails)
router.route('/service-status').patch(verifyJWT, authorizeRoles("mechanic"), appointmentController.updateServiceStatus);

export default router;