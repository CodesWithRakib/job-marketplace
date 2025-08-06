// app/api/recruiter/jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/schemas/Job";
import { getToken } from "next-auth/jwt";
import Application from "@/schemas/Application";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id || token.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find the job and verify it belongs to this recruiter
    const job = await Job.findOne({ _id: params.id, recruiterId: token.id });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or you don't have permission to access it" },
        { status: 404 }
      );
    }

    return NextResponse.json({ job });
  } catch (error: any) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch job" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id || token.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobData = await request.json();

    await dbConnect();

    // Find the job and verify it belongs to this recruiter
    const job = await Job.findOne({ _id: params.id, recruiterId: token.id });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    // Update the job
    const updatedJob = await Job.findByIdAndUpdate(params.id, jobData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error: any) {
    console.error("Error updating job:", error);

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

    return NextResponse.json(
      { error: error.message || "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find the job and verify it belongs to this recruiter
    const job = await Job.findOne({ _id: params.id, recruiterId: token.id });
    if (!job) {
      return NextResponse.json(
        { error: "Job not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Delete all applications for this job
    await Application.deleteMany({ jobId: params.id });

    // Delete the job
    await Job.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: "Job deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete job" },
      { status: 500 }
    );
  }
}
