import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_CLIENT_CONNECTION,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
  },
});

redisClient.on("connect", () => console.log("Redis connecting..."));
redisClient.on("ready", () => console.log("Redis ready"));
redisClient.on("end", () => console.warn("Redis disconnected"));
redisClient.on("error", (err) =>
  console.error("Redis Client Error:", err)
);

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export default redisClient;