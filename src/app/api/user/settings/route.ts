// app/api/user/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/schemas/User";
import { getToken } from "next-auth/jwt";

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

    // Find user settings
    const user = await User.findById(token.id).select(
      "emailNotifications jobAlerts notificationFrequency language theme privacySettings"
    );

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
      settings: {
        emailNotifications: user.emailNotifications,
        jobAlerts: user.jobAlerts,
        notificationFrequency: user.notificationFrequency,
        language: user.language,
        theme: user.theme,
        privacySettings: user.privacySettings,
      },
    });
  } catch (error: any) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch user settings",
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

    const {
      emailNotifications,
      jobAlerts,
      notificationFrequency,
      language,
      theme,
      privacySettings,
    } = await request.json();

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
    if (emailNotifications !== undefined)
      updateData.emailNotifications = emailNotifications;
    if (jobAlerts !== undefined) updateData.jobAlerts = jobAlerts;
    if (notificationFrequency !== undefined)
      updateData.notificationFrequency = notificationFrequency;
    if (language !== undefined) updateData.language = language;
    if (theme !== undefined) updateData.theme = theme;
    if (privacySettings !== undefined)
      updateData.privacySettings = privacySettings;

    // Update user settings
    const updatedUser = await User.findByIdAndUpdate(token.id, updateData, {
      new: true,
    }).select(
      "emailNotifications jobAlerts notificationFrequency language theme privacySettings"
    );

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: {
        emailNotifications: updatedUser.emailNotifications,
        jobAlerts: updatedUser.jobAlerts,
        notificationFrequency: updatedUser.notificationFrequency,
        language: updatedUser.language,
        theme: updatedUser.theme,
        privacySettings: updatedUser.privacySettings,
      },
    });
  } catch (error: any) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update user settings",
      },
      { status: 500 }
    );
  }
}
