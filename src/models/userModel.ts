import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // This allows multiple null or undefined values
    },
    password: { type: String, select: false },
    avatarUrl: { type: String },
    googleId: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
