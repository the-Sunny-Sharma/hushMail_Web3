import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import googleProvider from "next-auth/providers/google";
import { connectToDatabase } from "./lib/connectDB";
import { User } from "./models/userModel";
import { compare } from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  // Configure one or more authentication providers
  providers: [
    googleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    credentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        // Add logic here to look up the user from the credentials supplied
        const email = credentials.email as string;
        const password = credentials.password as string;
        if (!email || !password) {
          throw new CredentialsSignin({
            cause: "Please provide email and password",
          });
        }

        //connection with database here
        await connectToDatabase();

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
          throw new CredentialsSignin({ cause: "Invalid email or password" });
        }
        if (!user.password) {
          throw new CredentialsSignin({ cause: "Invalid email or password" });
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
          throw new CredentialsSignin({ cause: "Invalid email or password" });
        }
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        // Add logic here to send a welcome email to the user
        try {
          const { id, name, email, image } = user;

          if (!email) {
            throw new AuthError("Email is required");
          }
          await connectToDatabase();

          //Only create user if they do not exist
          const isAlreadyUser = await User.findOne({ email });
          if (!isAlreadyUser) {
            //username logic skipped
            await User.create({
              email,
              name,
              avatarUrl: image,
              googleId: id,
            });
          }

          return true;
        } catch (error) {
          console.log(`ERROR WHILE CREATING USER: ${error}`);
          throw new AuthError("Error while creating user");
        }
      }
      if (account?.provider === "credentials") return true;
      return false;
    },
  },
});
