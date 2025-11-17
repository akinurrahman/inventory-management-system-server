import { Session } from "../../models/session.model";
import { User } from "../../models/user.mode";
import { UnauthorizedError } from "../../utils";

export async function createSession(payload:any) {
  return Session.create(payload);
}

export async function rotateRefreshToken(refreshToken: string) {
  const session = await Session.findOne({ refreshToken, isActive: true });
  if (!session) throw new UnauthorizedError("Invalid or expired refresh token");

  const user = await User.findById(session.userId);
  if (!user || !user.isActive) throw new UnauthorizedError("User inactive");

  const newAccessToken = await user.generateAccessToken();
  const newRefreshToken = await user.generateRefreshToken();

  session.refreshToken = newRefreshToken;
  await session.save();

  return { newAccessToken, newRefreshToken };
}

export async function logout(refreshToken: string) {
  const session = await Session.findOne({ refreshToken });
  if (session) {
    session.isActive = false;
    await session.save();
  }
}
