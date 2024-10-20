import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/userModel";

export async function POST(req: Request) {
  await connectToDatabase();

  const { email, avatarUrl } = await req.json();

  if (!email || !avatarUrl) {
    return NextResponse.json(
      { error: "Email and avatarUrl are required" },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { avatarUrl } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    );
  }
}
