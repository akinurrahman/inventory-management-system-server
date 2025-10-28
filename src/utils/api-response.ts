import { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  pagination?: object
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination
  });
};


