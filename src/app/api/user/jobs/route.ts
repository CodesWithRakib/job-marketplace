// app/api/user/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/schemas/Job";
import { getToken } from "next-auth/jwt";
import User from "@/schemas/User";

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
    const salaryMin = searchParams.get("salaryMin") || "";
    const salaryMax = searchParams.get("salaryMax") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query: any = { status: "active" };

    // Add search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Add location filter if provided
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Add job type filter if provided
    if (type) {
      query.type = type;
    }

    // Add salary range filter if provided
    if (salaryMin || salaryMax) {
      query.salary = {};
      if (salaryMin) {
        query.salary.$gte = salaryMin;
      }
      if (salaryMax) {
        query.salary.$lte = salaryMax;
      }
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get jobs with pagination
    const jobs = await Job.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "recruiterId",
        select: "name email company profileImage",
      });

    // Get total count for pagination
    const total = await Job.countDocuments(query);

    // Check if user has saved any of these jobs
    const userId = token.id;
    const savedJobs = await Job.find({
      _id: { $in: jobs.map((job) => job._id) },
      savedBy: userId,
    }).select("_id");

    const savedJobIds = savedJobs.map((job) => job._id.toString());

    // Add saved flag to each job
    const jobsWithSavedFlag = jobs.map((job) => ({
      ...job.toObject(),
      isSaved: savedJobIds.includes(job._id.toString()),
    }));

    return NextResponse.json({
      success: true,
      jobs: jobsWithSavedFlag,
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
      {
        success: false,
        error: error.message || "Failed to fetch jobs",
      },
      { status: 500 }
    );
  }
}
