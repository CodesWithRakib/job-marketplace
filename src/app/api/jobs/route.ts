import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import Job from "@/schemas/Job";
import connectDB from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Different queries based on user role
    let jobs;

    if (session.user.role === "admin") {
      jobs = await Job.find({});
    } else if (session.user.role === "recruiter") {
      jobs = await Job.find({ recruiterId: session.user.id });
    } else {
      // Regular user - get active jobs
      jobs = await Job.find({ status: "active" });
    }

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Jobs fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "recruiter" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const jobData = await request.json();

    const newJobData = {
      ...jobData,
      recruiterId: session.user.id,
    };

    const job = await Job.create(newJobData);
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Job creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
