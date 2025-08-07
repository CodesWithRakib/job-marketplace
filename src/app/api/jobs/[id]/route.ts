import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import Job from "@/schemas/Job";
import connectDB from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const job = await Job.findById(params.id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Increment view count
    await Job.findByIdAndUpdate(params.id, { $inc: { views: 1 } });

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Job fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const job = await Job.findById(params.id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check if user is authorized to update this job
    if (
      session.user.role !== "admin" &&
      job.recruiterId.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const jobData = await request.json();
    const updatedJob = await Job.findByIdAndUpdate(params.id, jobData, {
      new: true,
    });
    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    console.error("Job update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const job = await Job.findById(params.id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check if user is authorized to delete this job
    if (
      session.user.role !== "admin" &&
      job.recruiterId.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Job.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Job deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
