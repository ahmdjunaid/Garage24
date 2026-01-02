
export const TYPES = {
  //Authentication
  AuthRepository: Symbol.for("AuthRepository"),
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),


  AdminRepository: Symbol.for("AdminRepository"),
  GarageRepository: Symbol.for("GarageRepository"),
  MechanicRepository: Symbol.for("MechanicRepository"),
  SubscriptionRepository: Symbol.for("SubscriptionRepository"),
  PlanRepository: Symbol.for("PlanRepository"),
  PaymentRepository: Symbol.for("PaymentRepository"),
  ServiceRepository: Symbol.for("ServiceRepository"),
  VehicleRepository: Symbol.for("VehicleRepository"),

  // Services
  AdminService: Symbol.for("AdminService"),
  GarageService: Symbol.for("GarageService"),
  MechanicService: Symbol.for("MechanicService"),
  StripeService: Symbol.for("StripeService"),
  SubscriptionService: Symbol.for("SubscriptionService"),
  PlanService: Symbol.for("PlanService"),
  PaymentService: Symbol.for("PaymentService"),
  ServiceService: Symbol.for("ServiceService"),
  VehicleService: Symbol.for("VehicleService"),

  // Controllers
  AdminController: Symbol.for("AdminController"),
  GarageController: Symbol.for("GarageController"),
  MechanicController: Symbol.for("MechanicController"),
  StripeController: Symbol.for("StripeController"),
  PlanController: Symbol.for("PlanController"),
  ServiceController: Symbol.for("ServiceController"),
  VehicleController: Symbol.for("VehicleController"),
};
