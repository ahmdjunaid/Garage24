import express from "express"
import { verifyJWT } from "../middleware/jwt"
import { authorizeRoles } from "../middleware/authorizeRoles"
import { container } from "../DI/container"
import { TYPES } from "../DI/types"
import { PlanController } from "../controllers/plan/implimentation/planController"
import { GarageController } from "../controllers/garage/implementation/garageController"
import { UserController } from "../controllers/user/implementation/userController"
import { DashboardController } from "../controllers/dashboard/implementation/dashboardController"

const router = express.Router()

const planController = container.get<PlanController>(TYPES.PlanController);
const garageController = container.get<GarageController>(TYPES.GarageController);
const userController = container.get<UserController>(TYPES.UserController);
const dashboardController = container.get<DashboardController>(TYPES.DashboardController)

router.route('/users').get(verifyJWT,authorizeRoles("admin"),userController.getAllUsers)
router.route('/garages').get(verifyJWT,authorizeRoles("admin"),garageController.getAllGarages)
router.route('/garage').get(verifyJWT,authorizeRoles("admin"),garageController.getGarageById)
router.route('/garage-details').get(verifyJWT,authorizeRoles("admin"),garageController.getGarageDetailsById)
router.route('/toggle-status/:userId').patch(verifyJWT,authorizeRoles("admin"),userController.toggleStatus)
router.route('/get-current-plan/:garageId').get(verifyJWT,authorizeRoles("admin"),garageController.getCurrentPlan)
router.route('/garage-approval/:userId').patch(verifyJWT,authorizeRoles("admin"),garageController.garageApproval)
router.route('/create-plan').post(verifyJWT, authorizeRoles("admin"), planController.createPlans)
router.route('/plans').get(verifyJWT,authorizeRoles("admin"),planController.getAllPlans)
router.route('/plans/:planId').put(verifyJWT,authorizeRoles("admin"),planController.updatePlan)
router.route('/toggle-plan-status/:planId').patch(verifyJWT,authorizeRoles("admin"),planController.toggleStatus)
router.route('/delete-plan/:planId').delete(verifyJWT,authorizeRoles("admin"),planController.deletePlan)

//Dashboard
router.route('/dashboard').get(verifyJWT,authorizeRoles("admin"), dashboardController.adminDashboardData)
router.route('/top-garages').get(verifyJWT,authorizeRoles("admin"), dashboardController.getTopFiveBookedGarages)

export default router;