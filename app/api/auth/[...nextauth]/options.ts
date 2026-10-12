import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Missing email/username or password");
        }

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("User not found with this email");
          }
          if (!user.isVerified) {
            throw new Error("User is not verified. Please verify your email.");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return user;
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Something went wrong during login");
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};