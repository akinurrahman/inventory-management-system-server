import { ApprovalRequest } from "../../../models/approval-request.model";
import { createPagination, getPaginationParams } from "../../../utils";

export const getProductApprovalRequests = async (
  query: Record<string, string | string[]>
) => {
  const { page, limit, skip } = getPaginationParams(query);

  const [data, total] = await Promise.all([
    ApprovalRequest.find({ entityType: "Product" })
      .populate("requestedBy", "fullName email")
      .populate("processedBy", "fullName email")
      .skip(skip)
      .limit(limit)
      .lean(),
    ApprovalRequest.countDocuments({ entityType: "Product" }),
  ]);

  const pagination = createPagination({
    page,
    limit,
    total,
  });

  return { data, message: "Fetched approval requests", pagination };
};


export const getProductApprovalRequestById = async (requestId: string) => {
  const request = await ApprovalRequest.findById(requestId)
    .populate("requestedBy", "fullName email")
    .populate("processedBy", "fullName email")
    .lean();
  if (!request) {
    return { data: null, message: "Approval request not found" };
  }
  return { data: request, message: "Fetched approval request" };
};