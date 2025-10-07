import z from "zod";
import { Request, Response, NextFunction } from "express";

export const validateBody = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const displayErrors = result.error.issues.map((err) => err.message);

      const debugErrors = result.error.issues;

      console.log("Debug Errors:", debugErrors); // optional logging

      return res.status(400).json({
        message: displayErrors[0] || "Validation failed", // first error for UI
        errors: displayErrors,
      });
    }

    req.body = result.data;
    next();
  };
};
