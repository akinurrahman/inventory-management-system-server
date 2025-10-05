import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "staff";
  isActive: boolean;
  lastLogin?: Date;
}


const userSchema = new mongoose.Schema<IUser>({
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["admin", "staff"], default: "staff"},
    isActive: {type: Boolean, default: true},
    lastLogin: {type: Date}
},{timestamps:true});

export const User = mongoose.model<IUser>("User", userSchema);