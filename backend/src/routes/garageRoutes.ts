import express from "express";
import { GarageController } from "../controllers/garage/garageController";
import { GarageRepository } from "../repositories/garageRepositories";
import { GarageService } from "../services/garageServices";
import { AuthRepository } from "../repositories/userRepositories";


const router = express.Router()

const garageRepository = new GarageRepository()
const authRepository = new AuthRepository()
const garageService = new GarageService(garageRepository, authRepository)
const garageController = new GarageController(garageService)

router.route('/onboarding').post(garageController.onboarding)

export default router;