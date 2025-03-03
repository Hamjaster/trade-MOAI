import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  nameOfSpace: string;
  verificationExpires?: number;
  verificationCode?: string;
  isVerified: boolean;
}

const UserSchema: Schema<UserDocument> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    nameOfSpace: { type: String, required: true },
    verificationCode: { type: String },
    verificationExpires: { type: Number },
    isVerified: { type: Boolean },
  },
  { timestamps: true }
);
const User = mongoose.model<UserDocument>("User", UserSchema);
export default User;
