import express from "express"
import { AdminController } from "../controllers/superAdmin/implementation/adminController"
import { verifyJWT } from "../middleware/jwt"
import { authorizeRoles } from "../middleware/authorizeRoles"
import { container } from "../DI/container"
import { TYPES } from "../DI/types"
import { PlanController } from "../controllers/plan/implimentation/planController"

const router = express.Router()

const adminController = container.get<AdminController>(TYPES.AdminController)
const planController = container.get<PlanController>(TYPES.PlanController)

router.route('/users').get(verifyJWT,authorizeRoles("admin"),adminController.getAllUsers)
router.route('/garages').get(verifyJWT,authorizeRoles("admin"),adminController.getAllGarages)
router.route('/garage').get(verifyJWT,authorizeRoles("admin"),adminController.getGarageById)
router.route('/toggle-status/:userId').patch(verifyJWT,authorizeRoles("admin"),adminController.toggleStatus)
router.route('/garage-approval/:userId').patch(verifyJWT,authorizeRoles("admin"),adminController.garageApproval)
router.route('/create-plan').post(verifyJWT, authorizeRoles("admin"), planController.createPlans)
router.route('/plans').get(verifyJWT,authorizeRoles("admin"),planController.getAllPlans)
router.route('/plans/:planId').put(verifyJWT,authorizeRoles("admin"),planController.updatePlan)
router.route('/toggle-plan-status/:planId').patch(verifyJWT,authorizeRoles("admin"),planController.toggleStatus)
router.route('/delete-plan/:planId').delete(verifyJWT,authorizeRoles("admin"),planController.deletePlan)

export default router;