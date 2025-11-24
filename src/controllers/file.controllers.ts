import asyncHandler from "../utils/async-handler";
import { BadRequestError, InternalServerError } from "../utils/errors";
import { sendResponse } from "../utils/api-response";
import { uploadToCloudinary } from "../services/cloudinary.service";

// Define the Multer file type
interface MulterFile {
  path: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
}

// Use type assertion inside the handler function to avoid asyncHandler typing issue
export const uploadFiles = asyncHandler(async (req, res) => {
  const files = req.files as MulterFile[] | undefined;

  if (!files || !files.length) {
    throw new BadRequestError("Please upload at least 1 file");
  }

  const fileUrls = [];
  for (let file of files) {
    const fileUrl = await uploadToCloudinary(file.path);
    if (fileUrl) {
      fileUrls.push(fileUrl.url);
    }
  }

  if (!fileUrls.length) {
    throw new InternalServerError("Failed to upload files");
  }

  sendResponse(res, fileUrls, "Files uploaded successfully", 200);
});
