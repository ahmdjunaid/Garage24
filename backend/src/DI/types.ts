
export const TYPES = {
  //Authentication
  AuthRepository: Symbol.for("AuthRepository"),
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),

  //Email
  EmailService: Symbol.for("EmailService"),

  //User
  UserRepository: Symbol.for("UserRepository"),
  UserService: Symbol.for("UserService"),
  UserController: Symbol.for("UserController"),

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
  SubscriptionController: Symbol.for("SubscriptionController"),

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

  //VehicleModel
  VehicleModelRepository: Symbol.for("VehicleModelRepository"),
  VehicleModelService: Symbol.for("VehicleModelService"),
  VehicleModelController: Symbol.for("VehicleModelController"),

  //ServiceCategory
  ServiceCategoryRepository: Symbol.for("ServiceCategoryRepository"),
  ServiceCategoryService: Symbol.for("ServiceCategoryService"),
  ServiceCategoryController: Symbol.for("ServiceCategoryController"),

  //Slot
  SlotRepository: Symbol.for("SlotRepository"),
  SlotService:  Symbol.for("SlotService"),
  SlotController: Symbol.for("SlotController"),

  //Appointment
  AppointmentRepository: Symbol.for("AppointmentRepository"),
  AppointmentService: Symbol.for("AppointmentService"),
  AppointmentController: Symbol.for("AppointmentController"),

  //Location
  LocationService: Symbol.for("LocationService"),
  LocationController: Symbol.for("LocationController"),

  //Notification
  NotificationRepository: Symbol.for("NotificationRepository"),
  NotificationService: Symbol.for("NotificationService"),
  NotificationController: Symbol.for("NotificationController"),
};
