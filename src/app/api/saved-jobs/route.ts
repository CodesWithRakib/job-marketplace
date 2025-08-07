import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import SavedJob from "@/schemas/SavedJob";
import connectDB from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const savedJobs = await SavedJob.find({ userId: session.user.id }).populate(
      "jobId"
    );

    return NextResponse.json({ savedJobs });
  } catch (error) {
    console.error("Saved jobs fetch error:", error);
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

    await connectDB();
    const { jobId, notes } = await request.json();

    // Check if already saved
    const existingSavedJob = await SavedJob.findOne({
      userId: session.user.id,
      jobId,
    });

    if (existingSavedJob) {
      return NextResponse.json({ error: "Job already saved" }, { status: 400 });
    }

    const savedJob = await SavedJob.create({
      userId: session.user.id,
      jobId,
      notes,
    });

    return NextResponse.json({ savedJob }, { status: 201 });
  } catch (error) {
    console.error("Saved job creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
