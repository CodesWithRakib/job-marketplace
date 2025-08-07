// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";

// This would typically interact with a Settings collection in your database
// For now, we'll return mock settings data

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id || token.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real application, you would fetch settings from your database
    const settings = {
      userRegistration: true,
      jobPosting: true,
      emailNotifications: true,
      analytics: true,
      maintenanceMode: false,
      siteName: "Job Marketplace",
      siteDescription: "Find your dream job or ideal candidate",
      adminEmail: "admin@jobmarketplace.com",
      maxFileSize: 5242880, // 5MB in bytes
      allowedFileTypes: [".pdf", ".doc", ".docx"],
      jobsPerPage: 10,
      applicationsPerPage: 10,
    };

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id || token.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settingsData = await request.json();

    // In a real application, you would update settings in your database
    // For now, we'll just return the updated settings
    return NextResponse.json({
      message: "Settings updated successfully",
      settings: settingsData,
    });
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
