import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/schemas/User";

export async function POST(request: NextRequest) {
  try {
    console.log("Register API endpoint called");

    const body = await request.json();
    console.log("Registration request body:", body);

    const { email, password, role, fullName } = body;

    if (!email || !password || !role || !fullName) {
      console.log("Missing fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();
    console.log("Database connected");

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("Password hashed");

    // Create user with the correct field name
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      name: fullName, // Use 'name' to match the schema
    });
    console.log("User created:", user);

    // Return success without password
    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;

    return NextResponse.json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Registration error in API route:", error);

    // Handle Mongoose validation errors specifically
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (val: any) => val.message
      );
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }

    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
