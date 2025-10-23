import express from "express";
import dotenv from "dotenv";
import logger from "./config/logger";
import connectDB from "./config/db";
import http from "http";
import cors from "cors";
import authRouter from "./routes/authRoutes";
import garageRouter from "../src/routes/garageRoutes"
import mechanicRouter from "../src/routes/mechanicRoutes"
import adminRouter from "../src/routes/adminRoutes"
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());


app.use(
  cors({
    origin: ["http://localhost:5173", "http://13.204.5.195:5173"],
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/garage", garageRouter);
app.use("/api/mechanic", mechanicRouter);
app.use("/api/admin", adminRouter);

connectDB();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`Server is running at ${PORT}`);
});