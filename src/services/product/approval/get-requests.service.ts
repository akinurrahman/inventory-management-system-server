import { ApprovalRequest } from "../../../models/approval-request.model";
import { createPagination, getPaginationParams } from "../../../utils";

export const getProductApprovalRequests = async (
  query: Record<string, string | string[]>
) => {
  const { page, limit, skip } = getPaginationParams(query);

  const [data, total] = await Promise.all([
    ApprovalRequest.find({ entityType: "Product" })
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
