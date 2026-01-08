import express from "express"
import { verifyJWT } from "../middleware/jwt";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { VehicleController } from "../controllers/vehicle/implimentation/vehicleController";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { uploadVehicleImage } from "../config/multerConfig";
import { BrandController } from "../controllers/brand/implementation/brandController";


const router = express.Router()
const vehicleController = container.get<VehicleController>(TYPES.VehicleController)
const brandController = container.get<BrandController>(TYPES.BrandController)

router.route("/vehicles").post(verifyJWT, uploadVehicleImage, authorizeRoles("user"), vehicleController.createVehicle)
router.route("/brands").get(verifyJWT, authorizeRoles("user"), brandController.getAllBrands)

export default router;