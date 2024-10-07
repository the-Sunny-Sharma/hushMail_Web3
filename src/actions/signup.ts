"use server";

import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/userModel";
import { hash } from "bcryptjs";

const CredentialsSignUp = async (
  name: string,
  email: string,
  password: string
) => {
  console.log(` Name: ${name}, Email: ${email}`);

  try {
    // Connect to the database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        message: "Email already in use.",
        status: 400,
      };
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the new user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return success message if everything went well
    return {
      message: "User created successfully!",
      status: 201, // HTTP 201: Created
    };
  } catch (error: unknown) {
    console.error("Error in sign-up:", error);

    // Check if the error is an instance of Error
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    // Return a more detailed error response
    return {
      message: "Failed to create user.",
      error:
        process.env.NODE_ENV === "development"
          ? errorMessage
          : "Internal server error",
      status: 500, // HTTP 500: Internal Server Error
    };
  }
};

export { CredentialsSignUp };
