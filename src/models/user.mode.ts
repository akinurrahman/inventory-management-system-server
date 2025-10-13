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
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  generateAccessToken: () => Promise<string>;
  generateRefreshToken: () => Promise<string>;
}


const userSchema = new mongoose.Schema<IUser>({
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique: true, index : true},
    password: {type: String, required: true, select: false},
    role: {type: String, enum: ["admin", "staff"], default: "staff"},
    isActive: {type: Boolean, default: true},
    lastLogin: {type: Date},

},{timestamps:true});


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


userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.generateAccessToken = async function () {
  const accessTokenSecret = config.get<string>("ACCESS_TOKEN_SECRET")
  const payload = {_id : this._id, role: this.role};
  const token = jwt.sign(payload, accessTokenSecret, {expiresIn: '15m'});

  return token;
}

userSchema.methods.generateRefreshToken = async function () {
  const refreshTokenSecret = config.get<string>("REFRESH_TOKEN_SECRET");
  const payload = {_id : this._id, role: this.role};
  const token = jwt.sign(payload, refreshTokenSecret, {expiresIn: '7d'});
  return token;
}



export const User = mongoose.model<IUser>("User", userSchema);