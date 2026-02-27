import { Server } from "socket.io";
import { Server as httpServer } from "http";
import logger from "../config/logger";
import { AppError } from "../middleware/errorHandler";
import HttpStatus from "../constants/httpStatusCodes";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { ChatService } from "../services/chat/implementaion/chatServices";

let io: Server;

export const initSocket = (server: httpServer) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const chatService = container.get<ChatService>(TYPES.ChatService);
    logger.info(`Connected: ${socket.id}`);

    socket.on("join", (userId: string) => {
      socket.join(userId);
    });

    socket.on("joinAppointmentRoom", async (appointmentId) => {
      const room = `appointment_${appointmentId}`;
      socket.join(room);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { appointmentId, message, senderId, senderRole } = data;

        const savedMessage = await chatService.sendMessage({
          appointmentId,
          senderId,
          message,
          senderRole,
          readBy: [senderId],
        });

        const participants = await chatService.getParticipants(appointmentId);
        
        participants.forEach((id) => {
          const userId = id.toString();
          
          if (userId !== senderId.toString()) {
            io.to(userId).emit("newMessageNotification", {
              appointmentId,
            });
          }
        });

        const room = `appointment_${appointmentId}`;
        io.to(room).emit("receiveMessage", savedMessage);
        
      } catch (error) {
        logger.error("Send message error", error);
      }
    });

    socket.on("markAsRead", async (appointmentId, userId) => {
      await chatService.markAsRead(appointmentId, userId)
    });
  });

  return io;
};

export const getIO = () => {
  if (!io)
    throw new AppError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Socket not initialized"
    );
  return io;
};
