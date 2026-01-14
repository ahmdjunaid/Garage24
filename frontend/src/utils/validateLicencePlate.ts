export function isValidIndianPlate(plate: string): boolean {
  const normalized = normalizePlate(plate);

  const patterns = [
    /^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{3,4}$/,
    /^[A-Z]{3}\d{3,4}$/,
    /^[A-Z]{1,2}\d{3,4}$/,
    /^BH\d{2}[A-Z]{2}\d{4}$/
  ];

  return patterns.some((regex) => regex.test(normalized));
}


function normalizePlate(plate: string) {
  return plate.toUpperCase().replace(/[^A-Z0-9]/g, "");
}