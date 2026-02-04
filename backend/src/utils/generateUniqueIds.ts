export const generateCustomId = (
  entity: "user" | "admin" | "garage" | "mechanic" | "transaction" | "appointment"
): string => {
  let customPart;

  if (entity === "user") {
    customPart = "USR";
  } else if (entity === "admin") {
    customPart = "ADM";
  } else if (entity === "garage") {
    customPart = "GAR";
  } else if (entity === "mechanic") {
    customPart = "MEC";
  } else if (entity === "transaction") {
    customPart = "TXN";
  } else if(entity === "appointment"){
    customPart = "APNT";
  } else {
    throw new Error("Invalid entity type");
  }

  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `G24-${customPart}-${randomPart}`;
};
