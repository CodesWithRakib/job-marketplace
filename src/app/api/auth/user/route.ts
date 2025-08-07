// app/api/auth/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/schemas/User";

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from the request
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Invalid authorization format" },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find user by ID (from token)
    const user = await User.findById(token);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user without password
    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;

    return NextResponse.json({
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get the auth token from the request
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Invalid authorization format" },
        { status: 401 }
      );
    }

    // Get update data from request body
    const { fullName, avatarUrl } = await request.json();

    // Connect to database
    await dbConnect();

    // Find user by ID
    const user = await User.findById(token);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user - use 'name' to match the schema
    const updates: any = {};
    if (fullName) updates.name = fullName; // Update 'name' field, not 'fullName'
    if (avatarUrl) updates.avatar_url = avatarUrl;

    const updatedUser = await User.findByIdAndUpdate(token, updates, {
      new: true,
    });

    // Return user without password
    const userObject = updatedUser.toObject();
    const { password: _, ...userWithoutPassword } = userObject;

    return NextResponse.json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
