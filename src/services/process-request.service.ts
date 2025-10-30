import mongoose from "mongoose";
import { APPROVAL_ACTION, APPROVAL_STATUS } from "../constants/enums";
import { ApprovalRequest } from "../models/approval-request.model";
import { IUser } from "../models/user.mode";
import { BadRequestError } from "../utils";
import { ApprovalInput } from "../validators/approval.validators";

export const processApprovalAction = async (
  id: string,
  user: IUser,
  body: ApprovalInput
) => {
  const { action, reason } = body;

  if (action === APPROVAL_STATUS.REJECTED) {
    const approvalRequest = await ApprovalRequest.findOneAndUpdate(
      { _id: id, status: APPROVAL_STATUS.PENDING },
      {
        status: APPROVAL_STATUS.REJECTED,
        reason,
        processedBy: user._id,
      },
      { new: true }
    );

    if (!approvalRequest) {
      throw new BadRequestError(
        "Invalid approval request or already processed"
      );
    }
    return { message: "Request processed successfully", data: approvalRequest };
  }

  if (action === APPROVAL_STATUS.APPROVED) {
    const approvalRequest = await ApprovalRequest.findOne({
      _id: id,
      status: APPROVAL_STATUS.PENDING,
    });

    if (!approvalRequest) {
      throw new BadRequestError(
        "Invalid approval request or already processed"
      );
    }

    const {
      entityType,
      entityId,
      action: requestAction,
      payload,
    } = approvalRequest;
    const Model = getEntityModel(entityType);

    const processedEntity = await processEntityAction(
      Model,
      requestAction,
      entityId ? entityId.toString() : null,
      payload
    );

    approvalRequest.status = APPROVAL_STATUS.APPROVED;
    approvalRequest.processedBy = user._id as mongoose.Schema.Types.ObjectId;
    await approvalRequest.save();

    return { message: "Request processed successfully", data: processedEntity };
  }

  throw new BadRequestError("Something went wrong");
};

const allowedEntities = ["Product"];
const restrictedEntities = ["User", "Session"];

export const getEntityModel = (entityType: string) => {
  if (restrictedEntities.includes(entityType)) {
    throw new BadRequestError(`Access denied for entity: ${entityType}`);
  }

  if (!allowedEntities.includes(entityType)) {
    throw new BadRequestError(`Unsupported entity type: ${entityType}`);
  }

  const Model = mongoose.models[entityType];
  if (!Model) {
    throw new BadRequestError(`Model not found for entity: ${entityType}`);
  }

  return Model;
};

export const processEntityAction = async (
  Model: mongoose.Model<mongoose.Document>,
  action: string,
  entityId: string | null,
  payload: any
) => {
  switch (action) {
    case APPROVAL_ACTION.CREATE:
      return Model.create(payload);
    case APPROVAL_ACTION.UPDATE:
      return Model.findByIdAndUpdate(entityId, payload, { new: true });
    case APPROVAL_ACTION.DELETE:
      return Model.findByIdAndDelete(entityId);
    default:
      throw new BadRequestError("Invalid action");
  }
};
