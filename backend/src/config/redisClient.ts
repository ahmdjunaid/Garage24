import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_CLIENT_CONNECTION,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error("Too many retries.");
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("error", (err) =>
  console.error("Redis Client Error:", err)
);

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Connected to Redis!");
  }
};

export default redisClient;
