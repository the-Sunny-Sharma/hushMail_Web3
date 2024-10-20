import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/userModel";

export async function POST(req: Request) {
  await connectToDatabase();

  const { username } = await req.json();

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const existingUser = await User.findOne({ username });
    return NextResponse.json({ isUnique: !existingUser });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { error: "Failed to check username" },
      { status: 500 }
    );
  }
}
