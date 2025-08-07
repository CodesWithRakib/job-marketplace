import { NextRequest, NextResponse } from "next/server";
import User from "@/schemas/User";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password, name, role = "user" } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
      status: "active",
    });

    // Return user without password
    const userWithoutPassword = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      profile: user.profile,
    };

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
