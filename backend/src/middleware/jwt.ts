import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../config/logger";
import { Request, Response, NextFunction } from "express";
import { DecodedUser } from "../types/user";
import HttpStatus from "../constants/httpStatusCodes";
import { AuthRepository } from "../repositories/user/implementation/userRepositories";
import { ACCOUNT_IS_BLOCKED } from "../constants/messages";

const userRepo = new AuthRepository()

const generateToken = (
  id: string | mongoose.Types.ObjectId | undefined,
  role: string | undefined
): string => {
  logger.info(`id: ${id}, role: ${role}`);

  return jwt.sign({ id: id, role: role }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (
  id: string | mongoose.Types.ObjectId | undefined,
  role: string | undefined
): string => {
  return jwt.sign(
    { id: id, role: role },
    process.env.REFRESH_JWT_SECRET as string,
    {
      expiresIn: "2d",
    }
  );
};

const generateResetToken = (id:string | mongoose.Types.ObjectId | undefined) => {
  return jwt.sign(
  {id: id},process.env.RESET_PASSWORD_SECRET as string,
  {expiresIn: "10m"}
  )
}

const verifyResetJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET!) as DecodedUser;

    req.user = decoded

    next();
  } catch (error: unknown) {
    console.error("JWT verification failed:", (error as Error).message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(HttpStatus.UNAUTHORIZED || 401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedUser;
    
    const user = await userRepo.findById(decoded.id)

    if(!user){
      return res.status(HttpStatus.NOT_FOUND).json({ message: "User not provided" });
    }

    if(user.isBlocked){
      return res.status(HttpStatus.FORBIDDEN).json({ message: ACCOUNT_IS_BLOCKED });
    }
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(HttpStatus.UNAUTHORIZED || 401).json({ message: "Invalid or expired token" });
  }
};

const verifyRefreshToken = (refreshToken: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET as string
    ) as JwtPayload;

    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};

export { generateToken, generateRefreshToken, generateResetToken, verifyResetJWT, verifyJWT, verifyRefreshToken };
