import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import { processApprovalAction } from "../services/process-request.service";
import { sendResponse } from "../utils";

export const processRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await processApprovalAction(
      req.params.id,
      req.user,
      req.body
    );
    sendResponse(res, result.data, result.message, 200);
  }
);
