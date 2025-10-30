import z from "zod";

export const approvalSchema = z.discriminatedUnion("action", [
    z.object({
        action: z.literal("approved"),
        reason: z.string().min(2).max(100).optional(),
    }),
    z.object({
        action: z.literal("rejected"),
        reason: z.string().min(2).max(100),
    }),
]);

export type ApprovalInput = z.infer<typeof approvalSchema>;