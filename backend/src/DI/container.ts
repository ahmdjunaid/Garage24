import { Container } from "inversify";
import { TYPES } from "./types";
import { AuthRepository } from "../repositories/auth/implementation/authRepositories";
import { AdminRepository } from "../repositories/superAdmin/implementation/adminRepositories";
import { GarageRepository } from "../repositories/garage/implementation/garageRepositories";
import { MechanicRepository } from "../repositories/mechanic/implementation/mechanicRepositories";
import { SubscriptionRepository } from "../repositories/subscription/implementation/subscriptionRepository";
import { AuthService } from "../services/auth/implementation/authServices";
import { AdminService } from "../services/superAdmin/implementation/adminService";
import { GarageService } from "../services/garage/implementation/garageServices";
import { MechanicService } from "../services/mechanic/implementation/mechanicService";
import { StripeService } from "../services/stripe/implementation/stripeServices";
import { Authcontroller } from "../controllers/auth/implementation/authController";
import { AdminController } from "../controllers/superAdmin/implementation/adminController";
import { GarageController } from "../controllers/garage/implementation/garageController";
import { MechanicController } from "../controllers/mechanic/implementation/mechanicController";
import { StripeController } from "../controllers/stripe/implementation/stripeController";
import { IAuthRepository } from "../repositories/auth/interface/IAuthRepositories";
import { IAdminRepository } from "../repositories/superAdmin/interface/IAdminRepository";
import { IGarageRepository } from "../repositories/garage/interface/IGarageRepository";
import { IMechanicRepository } from "../repositories/mechanic/interface/IMechanicRepository";
import { ISubscriptionRepository } from "../repositories/subscription/interface/ISubscriptionRepository";
import IAuthService from "../services/auth/interface/IAuthService";
import IAdminService from "../services/superAdmin/interface/IAdminService";
import IGarageService from "../services/garage/interface/IGarageService";
import IMechanicService from "../services/mechanic/interface/IMechanicService";
import IStripeService from "../services/stripe/interface/IStripeService";
import IAuthController from "../controllers/auth/interface/IAuthController";
import IAdminController from "../controllers/superAdmin/interface/IAdminController";
import IGarageController from "../controllers/garage/interface/IGarageController";
import IMechanicController from "../controllers/mechanic/interface/IMechanicController";
import IStripeController from "../controllers/stripe/interface/IStripeController";
import { User } from "../models/user";
import { Garage } from "../models/garage";
import ISubscriptionService from "../services/subscription/interface/ISubscriptionService";
import { SubscriptionService } from "../services/subscription/implimentation/subscriptionService";
import { IPlanRepository } from "../repositories/plan/interface/IPlanRepository";
import { PlanRepository } from "../repositories/plan/implimentation/planRepositories";
import IPlanService from "../services/plan/interface/IPlanService";
import { PlanService } from "../services/plan/implimentation/planService";
import IPlanController from "../controllers/plan/interface/IPlanController";
import { PlanController } from "../controllers/plan/implimentation/planController";
import { IPaymentRepository } from "../repositories/payment/interface/IPaymentRepositories";
import { paymentRepository } from "../repositories/payment/implimentation/paymentRepositories";
import IPaymentService from "../services/payment/interface/IPaymentService";
import { PaymentService } from "../services/payment/implimentation/paymentService";
import IServiceController from "../controllers/service/interface/IServiceController";
import { ServiceController } from "../controllers/service/implementation/serviceController";
import IServiceService from "../services/service/interface/IServiceService";
import { ServiceService } from "../services/service/implementation/serviceService";
import { IServiceRepository } from "../repositories/service/interface/IServiceRepository";
import { ServiceRepository } from "../repositories/service/implementation/serviceRepositories";
import { IVehicleRepository } from "../repositories/vehicle/interface/IVehicleRepository";
import { VehicleRepository } from "../repositories/vehicle/implementation/vehicleRepositories";
import { VehicleService } from "../services/vehicle/implimentation/vehicleService";
import IVehicleService from "../services/vehicle/interface/IVehicleService";
import IVehicleController from "../controllers/vehicle/interface/IVehicleController";
import { VehicleController } from "../controllers/vehicle/implimentation/vehicleController";
import { IBrandRepository } from "../repositories/brand/interface/IBrandRepository";
import { BrandRepository } from "../repositories/brand/implementation/brandRepository";
import { IBrandService } from "../services/brand/interface/IBrandService";
import { BrandService } from "../services/brand/implementation/brandService";
import { IBrandController } from "../controllers/brand/interface/IBrandController";
import { BrandController } from "../controllers/brand/implementation/brandController";
import { IVehicleModelRepository } from "../repositories/vehicleModel/interface/IVehicleModelRepository";
import { VehicleModelRepository } from "../repositories/vehicleModel/implementation/vehicleModelRepository";
import { IVehicleModelService } from "../services/vehicleModel/interface/IVehicleModelService";
import { VehicleModelService } from "../services/vehicleModel/implementation/vehicleModelService";

const container = new Container();

//Authentication
container.bind<IAuthRepository>(TYPES.AuthRepository).to(AuthRepository);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IAuthController>(TYPES.AuthController).to(Authcontroller);

//Admin
container.bind<IAdminRepository>(TYPES.AdminRepository).toDynamicValue(() => new AdminRepository(User, Garage));
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
container.bind<IAdminController>(TYPES.AdminController).to(AdminController);

//Garage
container.bind<IGarageRepository>(TYPES.GarageRepository).to(GarageRepository);
container.bind<IGarageService>(TYPES.GarageService).to(GarageService);
container.bind<IGarageController>(TYPES.GarageController).to(GarageController);

//Mechanic
container.bind<IMechanicRepository>(TYPES.MechanicRepository).to(MechanicRepository);
container.bind<IMechanicService>(TYPES.MechanicService).to(MechanicService);
container.bind<IMechanicController>(TYPES.MechanicController).to(MechanicController);

//Subscription
container.bind<ISubscriptionRepository>(TYPES.SubscriptionRepository).to(SubscriptionRepository);
container.bind<ISubscriptionService>(TYPES.SubscriptionService).to(SubscriptionService);

//Stripe
container.bind<IStripeService>(TYPES.StripeService).to(StripeService);
container.bind<IStripeController>(TYPES.StripeController).to(StripeController);

//Payment
container.bind<IPaymentRepository>(TYPES.PaymentRepository).to(paymentRepository);
container.bind<IPaymentService>(TYPES.PaymentService).to(PaymentService);

//Plan
container.bind<IPlanRepository>(TYPES.PlanRepository).to(PlanRepository);
container.bind<IPlanService>(TYPES.PlanService).to(PlanService);
container.bind<IPlanController>(TYPES.PlanController).to(PlanController);

//Service
container.bind<IServiceRepository>(TYPES.ServiceRepository).to(ServiceRepository);
container.bind<IServiceService>(TYPES.ServiceService).to(ServiceService);
container.bind<IServiceController>(TYPES.ServiceController).to(ServiceController);

//Vehicle
container.bind<IVehicleRepository>(TYPES.VehicleRepository).to(VehicleRepository);
container.bind<IVehicleService>(TYPES.VehicleService).to(VehicleService);
container.bind<IVehicleController>(TYPES.VehicleController).to(VehicleController);

//Brand
container.bind<IBrandRepository>(TYPES.BrandRepository).to(BrandRepository);
container.bind<IBrandService>(TYPES.BrandService).to(BrandService);
container.bind<IBrandController>(TYPES.BrandController).to(BrandController);

container.bind<IVehicleModelRepository>(TYPES.VehicleModelRepository).to(VehicleModelRepository);
container.bind<IVehicleModelService>(TYPES.VehicleModelService).to(VehicleModelService)

export { container };