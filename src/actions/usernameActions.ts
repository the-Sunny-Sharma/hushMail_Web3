"use server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/userModel";

// type UsernameCheckResponse = {
//   isUnique: boolean;
//   error?: boolean;
// };

type AddUsernameResponse = {
  error: boolean;
  message: string;
  status: number;
};

// Check if a username is unique
const isUsernameUnique = async (username: string) => {
  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ username });
    console.log(`${username} -> ${existingUser}`);
    if (existingUser) return { success: true, isUnique: false };
    else return { success: true, isUnique: true };
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return { success: false };
  }
};
// const isUsernameUnique = async (
//   username: string
// ): Promise<UsernameCheckResponse> => {
//   try {
//     await connectToDatabase();
//     const existingUser = await User.findOne({ username });
//     console.log(`${username} -> ${existingUser}`);
//     return { isUnique: !existingUser };
//   } catch (error) {
//     console.error("Error checking username uniqueness:", error);
//     return { isUnique: false, error: true };
//   }
// };

// Add username to user by email
const addUsername = async (
  username: string,
  email: string
): Promise<AddUsernameResponse> => {
  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return {
        error: true,
        message: "User with the provided email does not exist.",
        status: 404,
      };
    }

    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return {
        error: true,
        message: "Username is already taken. Please choose another.",
        status: 400,
      };
    }

    existingUser.username = username;
    await existingUser.save();

    return {
      error: false,
      message: "Username added successfully!",
      status: 201,
    };
  } catch (error) {
    console.error("Error in adding username:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return {
      error: true,
      message:
        process.env.NODE_ENV === "development"
          ? errorMessage
          : "Internal server error",
      status: 500,
    };
  }
};

// Check if a user already has a username
const checkUsername = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    if (user && user.username) {
      return { hasUsername: true };
    }
    return { hasUsername: false };
  } catch (error) {
    console.error("Error checking username:", error);
    return { error: true };
  }
};

export { addUsername, checkUsername, isUsernameUnique };
