export default interface IVehicleService {
  createVehicle(
    userId: string,
    licensePlate: string,
    make: string,
    model: string,
    registrationYear: number,
    fuelType: string,
    color: string,
    insuranceValidity: Date,
    puccValidity: Date,
    image: Express.Multer.File,
    variant?: string
  ): Promise<{ message: string }>;
}
