import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();

        const existingUser = await UserModel.findOne({ username, isVerified: true });

        if (existingUser) {
            return Response.json({success: false, message: "Username is already taken"}, {status: 400});
        }

    } catch (error) {
        console.log("Error registering user" ,error);
        return Response.json({success: false, message: "Error registering user"});
    }
}