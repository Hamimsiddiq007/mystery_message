import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();

        const existingUserByName = await UserModel.findOne({ username, isVerified: true });

        if (existingUserByName) {
            return Response.json({success: false, message: "Username is already taken"}, {status: 400});
        }

        const existingUserByEmail = await UserModel.findOne({ email, isVerified: true });
        const verifyCode = Math.floor(Math.random() * 1000000).toString();

        if (existingUserByEmail) {
            return Response.json({success: false, message: "Email is already taken"}, {status: 400});
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    message: []
            })

            await newUser.save();
        }

    } catch (error) {
        console.log("Error registering user" ,error);
        return Response.json({success: false, message: "Error registering user"});
    }
}