import express from "express";
import dotenv from "dotenv";
dotenv.config();
import logger from "./config/logger";
import connectDB from "./config/db";
import http from "http";
import cors from "cors";
import authRouter from "./routes/authRoutes";
import garageRouter from "../src/routes/garageRoutes";
import mechanicRouter from "../src/routes/mechanicRoutes";
import adminRouter from "../src/routes/adminRoutes";
import stripeRouter from "../src/routes/stripeRoutes";
import userRouter from "../src/routes/userRouter";
import notificationRouter from "../src/routes/notificationRouter"
import cookieParser from "cookie-parser";
import { connectRedis } from "./config/redisClient";
import "reflect-metadata";
import { errorHandler } from "./middleware/errorHandler";
import { startSubscriptionActivationJob } from "./jobs/subscriptionActivationJobs";
import { container } from "./DI/container";
import { SubscriptionService } from "./services/subscription/implimentation/subscriptionService";
import { TYPES } from "./DI/types";
import { initSocket } from "./socket/soket";

const app = express();
const server = http.createServer(app);

app.use(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  stripeRouter
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

initSocket(server);

app.use("/api/auth", authRouter);
app.use("/api/garage", garageRouter);
app.use("/api/mechanic", mechanicRouter);
app.use("/api/admin", adminRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/user", userRouter);
app.use("/api/notification", notificationRouter)

app.use(errorHandler);

async function bootstrap() {
  await connectDB();
  await connectRedis();

  const subscriptionService = container.get<SubscriptionService>(
    TYPES.SubscriptionService
  );

  startSubscriptionActivationJob(subscriptionService);

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    logger.info(`Server is running at ${PORT}`);
  });
}

bootstrap();
