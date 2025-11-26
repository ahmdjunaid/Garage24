
export const TYPES = {
  // Repositories
  AuthRepository: Symbol.for("AuthRepository"),
  AdminRepository: Symbol.for("AdminRepository"),
  GarageRepository: Symbol.for("GarageRepository"),
  MechanicRepository: Symbol.for("MechanicRepository"),
  SubscriptionRepository: Symbol.for("SubscriptionRepository"),
  PlanRepository: Symbol.for("PlanRepository"),

  // Services
  AuthService: Symbol.for("AuthService"),
  AdminService: Symbol.for("AdminService"),
  GarageService: Symbol.for("GarageService"),
  MechanicService: Symbol.for("MechanicService"),
  StripeService: Symbol.for("StripeService"),
  SubscriptionService: Symbol.for("SubscriptionService"),
  PlanService: Symbol.for("PlanService"),

  // Controllers
  AuthController: Symbol.for("AuthController"),
  AdminController: Symbol.for("AdminController"),
  GarageController: Symbol.for("GarageController"),
  MechanicController: Symbol.for("MechanicController"),
  StripeController: Symbol.for("StripeController"),
  PlanController: Symbol.for("PlanController")
};
