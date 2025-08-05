// app/api/user/saved-jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SavedJob from "@/schemas/SavedJob";
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

    // Get saved jobs for this user with pagination
    const savedJobs = await SavedJob.find({ userId: token.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("jobId");

    // Get total count for pagination
    const total = await SavedJob.countDocuments({ userId: token.id });

    return NextResponse.json({
      savedJobs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching saved jobs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch saved jobs" },
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

    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if job is already saved
    const existingSavedJob = await SavedJob.findOne({
      userId: token.id,
      jobId,
    });

    if (existingSavedJob) {
      return NextResponse.json(
        { error: "Job is already saved" },
        { status: 400 }
      );
    }

    // Create new saved job
    const newSavedJob = await SavedJob.create({
      userId: token.id,
      jobId,
    });

    // Populate job details for the response
    await newSavedJob.populate("jobId");

    return NextResponse.json({
      message: "Job saved successfully",
      savedJob: newSavedJob,
    });
  } catch (error: any) {
    console.error("Error saving job:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save job" },
      { status: 500 }
    );
  }
}
