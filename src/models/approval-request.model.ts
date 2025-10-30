import mongoose from "mongoose";
import { APPROVAL_ACTION, APPROVAL_STATUS } from "../constants/enums";

export interface IApprovalRequest extends mongoose.Document {
  entityType: string;
  entityId: mongoose.Schema.Types.ObjectId | null;
  action: "create" | "update" | "delete";
  payload: Record<string, any>;
  status: "pending" | "approved" | "rejected";
  reason?: string;
  requestedBy: mongoose.Schema.Types.ObjectId;
  processedBy?: mongoose.Schema.Types.ObjectId;
}

const approvalRequestSchema = new mongoose.Schema<IApprovalRequest>(
  {
    entityType: {
      type: String,
      required: true, // eg. "Product", "Supplier" etc. its basically the model name
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "entityType", // reference to the actual entity
      default: null, // null for create requests
    },
    action: {
      type: String,
      required: true,
      enum: Object.values(APPROVAL_ACTION),
    },
    payload: {
      type: mongoose.Schema.Types.Mixed, // stores the data related to the request
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(APPROVAL_STATUS),
      default: APPROVAL_STATUS.PENDING,
    },
    reason: {
      type: String, // reason for rejection if status is rejected
      default: null,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

approvalRequestSchema.index({ entityType: 1, status: 1 });

export const ApprovalRequest = mongoose.model<IApprovalRequest>(
  "ApprovalRequest",
  approvalRequestSchema
);
