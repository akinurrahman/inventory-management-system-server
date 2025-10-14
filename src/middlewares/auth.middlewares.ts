import jwt from "jsonwebtoken";
import config from "config";

import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils";
import { User } from "../models/user.mode";

interface JwtPayload {
  _id: string;
  role: string;
  iat: number;
  exp: number;
}

export const requireAuth = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    const accessTokenSecret = config.get<string>("ACCESS_TOKEN_SECRET");
    if (!token)
      throw new UnauthorizedError(
        "Authentication required. No token provided."
      );

    let decode: JwtPayload;

    try {
      decode = jwt.verify(token, accessTokenSecret) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token.");
    }

    const user = await User.findById(decode._id);

    if (!user || !user.isActive)
      throw new UnauthorizedError("User not found or no longer active.");

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export const requireRoles = (roles: ("admin" | "staff")[]) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) throw new ForbiddenError("No user found! access denied.");

    if (!roles.includes(user.role))
      throw new ForbiddenError(`Access denied. ${roles.join(" or ")} role required.`);

    next();
  };
};
