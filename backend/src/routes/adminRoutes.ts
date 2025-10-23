import express from "express"
import { AdminRepository } from "../repositories/superAdmin/implementation/adminRepositories"
import User from "../models/user"
import { Garage } from "../models/garage"
import { AdminService } from "../services/superAdmin/implementation/adminService"
import { AdminController } from "../controllers/superAdmin/implementation/adminController"
import { verifyJWT } from "../middleware/jwt"

const router = express.Router()

const adminRepository = new AdminRepository(User,Garage)
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService)

router.route('/users').get(verifyJWT,adminController.getAllUsers)
router.route('/garages').get(verifyJWT,adminController.getAllGarages)
router.route('/toggle-status/:userId').patch(verifyJWT,adminController.toggleStatus)

export default router;