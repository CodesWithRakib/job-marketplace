// app/api/user/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/schemas/Application";
import Job from "@/schemas/Job";
import User from "@/schemas/User";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "all";
    const skip = (page - 1) * limit;

    // Build query based on filters
    const query: any = { userId: token.id };
    if (status !== "all") {
      query.status = status;
    }

    // Get applications for this user with pagination and filtering
    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "jobId",
        select: "title company location type salary status recruiterId",
        populate: {
          path: "recruiterId",
          select: "name email company",
        },
      });

    // Get total count for pagination
    const total = await Application.countDocuments(query);

    return NextResponse.json({
      success: true,
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
      {
        success: false,
        error: error.message || "Failed to fetch applications",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { jobId, coverLetter } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        {
          success: false,
          error: "Job ID is required",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: "Job not found",
        },
        { status: 404 }
      );
    }

    // Check if job is still active
    if (job.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          error: "This job is no longer accepting applications",
        },
        { status: 400 }
      );
    }

    // Check if user already applied to this job
    const existingApplication = await Application.findOne({
      userId: token.id,
      jobId,
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already applied to this job",
        },
        { status: 400 }
      );
    }

    // Get user details for notification
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

    // Create new application
    const newApplication = await Application.create({
      userId: token.id,
      jobId,
      coverLetter: coverLetter || "",
      status: "pending",
    });

    // Populate job and user details for the response
    await newApplication.populate([
      {
        path: "jobId",
        select: "title company location type salary",
      },
      {
        path: "userId",
        select: "name email",
      },
    ]);

    // In a real application, you would send notifications to the recruiter here
    // For example: sendNotification(job.recruiterId, "New Application", `${user.name} applied to ${job.title}`);

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error: any) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create application",
      },
      { status: 500 }
    );
  }
}
