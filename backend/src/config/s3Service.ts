import { S3Client, PutObjectCommand, DeleteObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESSKEY!,
    secretAccessKey: process.env.AWS_S3_SECRET!,
  },
});

export const uploadFile = async (
  file: Express.Multer.File,
  folder: "profile" | "garages"
): Promise<string> => {
  const fileContent = fs.readFileSync(file.path);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: `uploads/${folder}/${file.filename}`,
    Body: fileContent,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));

  const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${folder}/${file.filename}`;
  return fileUrl;
};

export const deleteFromS3 = async (fileName: string): Promise<void> => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: `uploads/${fileName}`,
  };

  await s3.send(new DeleteObjectCommand(params));
};
