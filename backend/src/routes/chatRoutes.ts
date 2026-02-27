import express from "express";
import { verifyJWT } from "../middleware/jwt";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { ChatController } from "../controllers/chat/implementaion/chatController";


const router = express.Router()
const chatController = container.get<ChatController>(TYPES.ChatController)

//Chat
router.route('/appointments').get(verifyJWT, chatController.getAppointmentsForChat)
router.route('/appointments/:appointmentId').get(verifyJWT, chatController.getAppointmentForChatById)
router.route('/messages/:appointmentId').get(verifyJWT, chatController.getMessagesByAppointmentId)
router.route('/unread-count').get(verifyJWT, chatController.getUnreadCount)

export default router;