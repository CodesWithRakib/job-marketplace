// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/schemas/User";
import { getToken } from "next-auth/jwt";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find user and exclude sensitive fields
    const user = await User.findById(token.id).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch user profile",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const data = await request.formData();
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const bio = data.get("bio") as string;
    const location = data.get("location") as string;
    const website = data.get("website") as string;
    const profileImage = data.get("profileImage") as File;

    await dbConnect();

    // Find user
    const user = await User.findById(token.id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (bio) updateData.bio = bio;
    if (location) updateData.location = location;
    if (website) updateData.website = website;

    // Handle profile image upload if provided
    if (profileImage) {
      const bytes = await profileImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const fileName = `${token.id}-${Date.now()}-${profileImage.name}`;
      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "profiles",
        fileName
      );

      // Write file to disk
      await writeFile(filePath, buffer);

      // Update user with profile image path
      updateData.profileImage = `/uploads/profiles/${fileName}`;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(token.id, updateData, {
      new: true,
    }).select("-password");

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update user profile",
      },
      { status: 500 }
    );
  }
}
