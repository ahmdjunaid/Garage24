import express from "express"
import { verifyJWT } from "../middleware/jwt";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { VehicleController } from "../controllers/vehicle/implimentation/vehicleController";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { uploadVehicleImage } from "../config/multerConfig";
import { BrandController } from "../controllers/brand/implementation/brandController";
import { VehicleModelController } from "../controllers/vehicleModel/implementation/vehicleModelController";
import { AppointmentController } from "../controllers/appointment/implementation/appointmentController";


const router = express.Router()
const vehicleController = container.get<VehicleController>(TYPES.VehicleController)
const brandController = container.get<BrandController>(TYPES.BrandController)
const vehicleModelController = container.get<VehicleModelController>(TYPES.VehicleModelController)
const appointmentController = container.get<AppointmentController>(TYPES.AppointmentController)

router.route("/vehicles").post(verifyJWT, uploadVehicleImage, authorizeRoles("user"), vehicleController.createVehicle)
router.route("/vehicles").get(verifyJWT, authorizeRoles("user"), vehicleController.getAllVehicleByUserId)
router.route("/vehicle").get(verifyJWT, authorizeRoles("user"), vehicleController.getVehicleById)
router.route("/brands").get(verifyJWT, authorizeRoles("user"), brandController.getAllBrands)
router.route("/:brandId/vehicle-models").get(verifyJWT, authorizeRoles("user"), vehicleModelController.getAllVehicleModelsByBrand)
router.route("/appointment/page-meta").get(verifyJWT, authorizeRoles("user"), appointmentController.getAppointmentMetaData)

export default router;