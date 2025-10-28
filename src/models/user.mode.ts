import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "staff";
  isActive: boolean;
  lastLogin?: Date;
  otp?: string;
  otpExpiry?: Date;
  resetToken?: string;


  comparePassword: (incommingPassword: string) => Promise<boolean>;
  generateAccessToken: () => Promise<string>;
  generateRefreshToken: () => Promise<string>;
  hashOtp: (plainOtp: string) => Promise<void>;
  compareOtp: (incommingOtp: string) => Promise<boolean>;
  generateResetToken : ()=> Promise<string>
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "staff"], default: "staff" },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },

    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
    resetToken: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashed = await bcrypt.hash(this.password, 12);
    this.password = hashed;
    next();
  } catch (err) {
    next(err as Error);
  }
});

userSchema.methods.comparePassword = async function (
  incommingPassword: string
): Promise<boolean> {
  return bcrypt.compare(incommingPassword, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  const accessTokenSecret = config.get<string>("ACCESS_TOKEN_SECRET");
  const nodeEnv = config.get<string>("NODE_ENV");
  const payload = { _id: this._id, role: this.role };
  const token = jwt.sign(payload, accessTokenSecret, { expiresIn: nodeEnv === "production" ? "15m" : "7d" });

  return token;
};

userSchema.methods.generateRefreshToken = async function () {
  const refreshTokenSecret = config.get<string>("REFRESH_TOKEN_SECRET");
  const payload = { _id: this._id, role: this.role };
  const token = jwt.sign(payload, refreshTokenSecret, { expiresIn: "7d" });
  return token;
};

userSchema.methods.hashOtp = async function (plainOtp: string) {
  const hashedOtp = await bcrypt.hash(plainOtp, 12);
  this.otp = hashedOtp;

  this.otpExpiry = new Date(Date.now() + 1000 * 60 * 10);
};

userSchema.methods.compareOtp = async function (incommingOtp: string) {
  return bcrypt.compare(incommingOtp, this.otp);
};

userSchema.methods.generateResetToken = async function () {
  const tokenSecret = config.get<string>("RESET_TOKEN_SECRET");

  const token = jwt.sign({ userId: this._id }, tokenSecret, {
    expiresIn: "10m",
  });

  

  return token;
};



export const User = mongoose.model<IUser>("User", userSchema);
