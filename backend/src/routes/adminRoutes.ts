import express from "express"
import { AdminRepository } from "../repositories/superAdmin/implementation/adminRepositories"
import User from "../models/user"
import { Garage } from "../models/garage"
import { AdminService } from "../services/superAdmin/implementation/adminService"
import { AdminController } from "../controllers/superAdmin/implementation/adminController"
import { verifyJWT } from "../middleware/jwt"
import { authorizeRoles } from "../middleware/authorizeRoles"
import { Plan } from "../models/plan"
import { GarageRepository } from "../repositories/garage/implementation/garageRepositories"

const router = express.Router()

const adminRepository = new AdminRepository(User,Garage,Plan)
const garageRepository = new GarageRepository()
const adminService = new AdminService(adminRepository, garageRepository)
const adminController = new AdminController(adminService)

router.route('/users').get(verifyJWT,authorizeRoles("admin"),adminController.getAllUsers)
router.route('/garages').get(verifyJWT,authorizeRoles("admin"),adminController.getAllGarages)
router.route('/garage').get(verifyJWT,authorizeRoles("admin"),adminController.getGarageById)
router.route('/toggle-status/:userId').patch(verifyJWT,authorizeRoles("admin"),adminController.toggleStatus)
router.route('/garage-approval/:userId').patch(verifyJWT,authorizeRoles("admin"),adminController.garageApproval)
router.route('/create-plan').post(verifyJWT, authorizeRoles("admin"), adminController.createPlans)
router.route('/plans').get(verifyJWT,authorizeRoles("admin"),adminController.getAllPlans)

export default router;