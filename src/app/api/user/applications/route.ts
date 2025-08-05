// app/api/user/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/schemas/Application";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get applications for this user with pagination
    const applications = await Application.find({ userId: token.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("jobId", "title company location type salary");

    // Get total count for pagination
    const total = await Application.countDocuments({ userId: token.id });

    return NextResponse.json({
      applications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching user applications:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, coverLetter } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already applied to this job
    const existingApplication = await Application.findOne({
      userId: token.id,
      jobId,
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 400 }
      );
    }

    // Create new application
    const newApplication = await Application.create({
      userId: token.id,
      jobId,
      coverLetter: coverLetter || "",
      status: "pending",
    });

    // Populate job details for the response
    await newApplication.populate("jobId", "title company");

    return NextResponse.json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error: any) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create application" },
      { status: 500 }
    );
  }
}
