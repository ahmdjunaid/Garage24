import type { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const tempDir = path.join(__dirname, "..", "uploads", "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, tempDir),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()} - ${file.originalname}`),
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (file.fieldname === "image" || file.fieldname === "profile" || file.fieldname === "images") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed"));
      }
    }

    if (file.fieldname === "document") {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];

      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Document must be an image or PDF"));
      }
    }

    cb(null, true);
  },
});

export const uploadProfile = upload.single("profile");

export const uploadOnboardingImages = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "document", maxCount: 1 },
]);

export const uploadGallery = upload.array("images", 5);
