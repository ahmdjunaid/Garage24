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
import { LocationController } from "../controllers/location/implementation/locationController";
import { GarageController } from "../controllers/garage/implementation/garageController";
import { ServiceController } from "../controllers/service/implementation/serviceController";
import { SlotController } from "../controllers/slot/implementation/slotController";


const router = express.Router()
const vehicleController = container.get<VehicleController>(TYPES.VehicleController)
const brandController = container.get<BrandController>(TYPES.BrandController)
const vehicleModelController = container.get<VehicleModelController>(TYPES.VehicleModelController)
const appointmentController = container.get<AppointmentController>(TYPES.AppointmentController)
const locationController = container.get<LocationController>(TYPES.LocationController)
const garageController = container.get<GarageController>(TYPES.GarageController)
const serviceController = container.get<ServiceController>(TYPES.ServiceController)
const slotController = container.get<SlotController>(TYPES.SlotController)

router.route('/vehicles').post(verifyJWT, uploadVehicleImage, authorizeRoles("user"), vehicleController.createVehicle)
router.route('/vehicles').get(verifyJWT, authorizeRoles("user"), vehicleController.getAllVehicleByUserId)
router.route('/vehicle').get(verifyJWT, authorizeRoles("user"), vehicleController.getVehicleById)
router.route('/brands').get(verifyJWT, authorizeRoles("user"), brandController.getAllBrands)
router.route('/:brandId/vehicle-models').get(verifyJWT, authorizeRoles("user"), vehicleModelController.getAllVehicleModelsByBrand)
router.route('/appointment/page-meta').get(verifyJWT, authorizeRoles("user"), appointmentController.getAppointmentMetaData)
router.route('/get-address').get(verifyJWT,authorizeRoles("user"),locationController.getAddressFromCoordinates)
router.route('/get-coordinates').get(verifyJWT,authorizeRoles("user"),locationController.getCoordinatesFromName)
router.route('/garages/nearby').get(verifyJWT, authorizeRoles("user"), garageController.findNearbyGarages)
router.route('/services/available').get(verifyJWT, authorizeRoles("user"), serviceController.getServicesByGarageId)
router.route('/slots/available').get(verifyJWT, authorizeRoles("user"), slotController.getSlotsByGarageIdAndDate)
router.route('/appointment/book').post(verifyJWT, authorizeRoles("user"), appointmentController.createAppointment)
router.route('/appointment/success/:appointmentId').get(verifyJWT, authorizeRoles("user"), appointmentController.getAppointmentDetails)
router.route('/appointment').get(verifyJWT, authorizeRoles("user"), appointmentController.getAllAppointmentsByUserId)
router.route('/appointment/cancel/:appointmentId').patch(verifyJWT, authorizeRoles("user"), appointmentController.cancelAppointment)

export default router;