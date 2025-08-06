// app/api/recruiter/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/schemas/Job";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id || token.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const status = searchParams.get("status") || null;
    // Build query
    const query: any = { recruiterId: token.id };
    if (status) {
      query.status = status;
    }
    // Get jobs for this recruiter with pagination
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    // Get total count for pagination
    const total = await Job.countDocuments(query);
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
    console.error("Error fetching recruiter jobs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id || token.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobData = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "company",
      "description",
      "location",
      "type",
      "salary",
    ];
    for (const field of requiredFields) {
      if (!jobData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    await dbConnect();

    // Process skills if provided as a comma-separated string
    let skillsArray = [];
    if (jobData.skills && typeof jobData.skills === "string") {
      skillsArray = jobData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
    }

    // Create new job with the recruiter's ID from token (not from request body for security)
    const newJob = await Job.create({
      title: jobData.title,
      company: jobData.company,
      description: jobData.description,
      location: jobData.location,
      type: jobData.type,
      salary: jobData.salary,
      status: jobData.status || "active", // Set default status if not provided
      applicationDeadline: jobData.applicationDeadline || null,
      experience: jobData.experience || null,
      skills: skillsArray,
      recruiterId: token.id, // Use token ID for security
      applicationCount: 0, // Initialize application count
    });

    return NextResponse.json(
      {
        message: "Job created successfully",
        job: newJob,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating job:", error);
    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A job with this title already exists for your company" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create job" },
      { status: 500 }
    );
  }
}
