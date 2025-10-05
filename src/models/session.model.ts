import mongoose, {Document} from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  ip?: string;
  userAgent?: string;
  location?: string;
  accessToken?: string;
  expiresAt: Date;
  isActive: boolean;
}

const sessionSchema = new mongoose.Schema<ISession>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: { type: String, required: true, unique: true },
    ip: { type: String },
    userAgent: { type: String },
    location: { type: String },
    accessToken: { type: String },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Session = mongoose.model<ISession>("Session", sessionSchema);
