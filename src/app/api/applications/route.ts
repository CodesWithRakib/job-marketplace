import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import Application from "@/schemas/Application";
import connectDB from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let applications;

    if (session.user.role === "admin") {
      applications = await Application.find({});
    } else if (session.user.role === "recruiter") {
      // Get jobs by this recruiter, then applications for those jobs
      const Job = (await import("@/schemas/Job")).default;
      const jobs = await Job.find({ recruiterId: session.user.id });
      const jobIds = jobs.map((job) => job._id);
      applications = await Application.find({ jobId: { $in: jobIds } });
    } else {
      // Regular user - get their applications
      applications = await Application.find({ userId: session.user.id });
    }

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Applications fetch error:", error);
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

    if (session.user.role !== "user") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const { jobId, coverLetter, resumeUrl } = await request.json();

    // Check if user already applied to this job
    const existingApplication = await Application.findOne({
      userId: session.user.id,
      jobId,
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "Already applied to this job" },
        { status: 400 }
      );
    }

    const application = await Application.create({
      userId: session.user.id,
      jobId,
      coverLetter,
      resumeUrl,
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Application creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
