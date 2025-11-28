import fs from "fs";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from 'config'

const cloudName =  config.get<string>('CLOUDINARY_CLOUD_NAME')
const apiKey =  config.get<string>('CLOUDINARY_API_KEY')
const secret =  config.get<string>('CLOUDINARY_API_SECRET')
const folder = config.get<string>("CLOUD_FOLDER");

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: secret,
});

export const uploadToCloudinary = async (
  localFilePath: string
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};
