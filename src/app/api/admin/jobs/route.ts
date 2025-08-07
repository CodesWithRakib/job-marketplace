// app/api/admin/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Job from "@/schemas/Job";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get jobs with pagination
    const jobs = await Job.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("recruiterId", "name email"); // Populate recruiter information

    // Get total count for pagination
    const total = await Job.countDocuments();

    return NextResponse.json({
      jobs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
