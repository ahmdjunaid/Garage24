import mongoose from "mongoose";
import logger from "./logger";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Mongo DB URI is not defined in env file");
    }
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`Connected ${connect.connection.host}`);
  } catch (error) {
    logger.error("Error while connecting to mongoDB", error);
    return;
  }
};

export default connectDB;
