import { Server } from "socket.io";
import { Server as httpServer } from "http";
import logger from "../config/logger";
import { AppError } from "../middleware/errorHandler";
import HttpStatus from "../constants/httpStatusCodes";


let io: Server;

export const initSocket = (server: httpServer) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`Connected: ${socket.id}`);

    socket.on("join", (userId: string) => {
      socket.join(userId);
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
