export const TYPES = {
  //Authentication
  AuthRepository: Symbol.for("AuthRepository"),
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),

  //Admin
  AdminRepository: Symbol.for("AdminRepository"),
  AdminService: Symbol.for("AdminService"),
  AdminController: Symbol.for("AdminController"),

  //Garage
  GarageRepository: Symbol.for("GarageRepository"),
  GarageService: Symbol.for("GarageService"),
  GarageController: Symbol.for("GarageController"),

  //Mechanic
  MechanicRepository: Symbol.for("MechanicRepository"),
  MechanicService: Symbol.for("MechanicService"),
  MechanicController: Symbol.for("MechanicController"),

  //Subscription
  SubscriptionRepository: Symbol.for("SubscriptionRepository"),
  SubscriptionService: Symbol.for("SubscriptionService"),

  //Stripe
  StripeService: Symbol.for("StripeService"),
  StripeController: Symbol.for("StripeController"),

  //Plan
  PlanRepository: Symbol.for("PlanRepository"),
  PlanService: Symbol.for("PlanService"),
  PlanController: Symbol.for("PlanController"),

  //Payment
  PaymentRepository: Symbol.for("PaymentRepository"),
  PaymentService: Symbol.for("PaymentService"),

  //Service
  ServiceRepository: Symbol.for("ServiceRepository"),
  ServiceService: Symbol.for("ServiceService"),
  ServiceController: Symbol.for("ServiceController"),
  
  //Vehicle
  VehicleRepository: Symbol.for("VehicleRepository"),
  VehicleService: Symbol.for("VehicleService"),
  VehicleController: Symbol.for("VehicleController"),

  //Brand
  BrandRepository: Symbol.for("BrandRepository"),
  BrandService: Symbol.for("BrandService"),
  BrandController: Symbol.for("BrandController"),
};
