import express from "express"
import { verifyJWT } from "../middleware/jwt"
import { container } from "../DI/container"
import { TYPES } from "../DI/types"
import { NotificationController } from "../controllers/notification/implementation/notificationController"

const router = express.Router()
const notificationController = container.get<NotificationController>(TYPES.NotificationController)

router.route('/')
    .get(verifyJWT, notificationController.getNotificationByUserId)
    .patch(verifyJWT, notificationController.markAllAsRead)
router.route('/:notifId').patch(verifyJWT, notificationController.markAsRead)

export default router;