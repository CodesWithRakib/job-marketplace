// app/api/user/saved-jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SavedJob from "@/schemas/SavedJob";
import Job from "@/schemas/Job";
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

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const type = searchParams.get("type") || "";
    const sortBy = searchParams.get("sortBy") || "savedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query: any = { userId: token.id };

    // Add search filter if provided
    if (search) {
      query.$or = [
        { "jobId.title": { $regex: search, $options: "i" } },
        { "jobId.company": { $regex: search, $options: "i" } },
        { "jobId.description": { $regex: search, $options: "i" } },
      ];
    }

    // Add location filter if provided
    if (location) {
      query["jobId.location"] = { $regex: location, $options: "i" };
    }

    // Add job type filter if provided
    if (type) {
      query["jobId.type"] = type;
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get saved jobs for this user with pagination and filtering
    const savedJobs = await SavedJob.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "jobId",
        select: "title company location type salary status applicationCount",
        populate: {
          path: "recruiterId",
          select: "name email company profileImage",
        },
      });

    // Get total count for pagination
    const total = await SavedJob.countDocuments(query);

    return NextResponse.json({
      success: true,
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
      {
        success: false,
        error: error.message || "Failed to fetch saved jobs",
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

    const { jobId } = await request.json();

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

    // Check if the job exists and is active

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

    if (job.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot save inactive jobs",
        },
        { status: 400 }
      );
    }

    // Check if job is already saved
    const existingSavedJob = await SavedJob.findOne({
      userId: token.id,
      jobId,
    });

    if (existingSavedJob) {
      return NextResponse.json(
        {
          success: false,
          error: "Job is already saved",
        },
        { status: 400 }
      );
    }

    // Create new saved job
    const newSavedJob = await SavedJob.create({
      userId: token.id,
      jobId,
    });

    // Populate job details for the response
    await newSavedJob.populate({
      path: "jobId",
      select: "title company location type salary status applicationCount",
      populate: {
        path: "recruiterId",
        select: "name email company profileImage",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Job saved successfully",
      savedJob: newSavedJob,
    });
  } catch (error: any) {
    console.error("Error saving job:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save job",
      },
      { status: 500 }
    );
  }
}
