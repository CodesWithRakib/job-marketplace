// app/api/recruiter/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/schemas/Application";
import Job from "@/schemas/Job";
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

    // Get all job IDs for this recruiter
    const recruiterJobs = await Job.find({ recruiterId: token.id }).select(
      "_id"
    );
    const jobIds = recruiterJobs.map((job) => job._id);

    // Get applications for this recruiter's jobs with pagination
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email image")
      .populate("jobId", "title company");

    // Get total count for pagination
    const total = await Application.countDocuments({ jobId: { $in: jobIds } });

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
    console.error("Error fetching recruiter applications:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
