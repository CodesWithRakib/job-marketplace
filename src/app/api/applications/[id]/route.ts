import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import Application from "@/schemas/Application";
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
    const application = await Application.findById(params.id)
      .populate("userId", "name email image")
      .populate("jobId");

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to view this application
    if (
      session.user.role !== "admin" &&
      application.userId._id.toString() !== session.user.id &&
      application.jobId.recruiterId.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Application fetch error:", error);
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
    const application = await Application.findById(params.id);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to update this application
    if (session.user.role !== "admin") {
      const Job = (await import("@/schemas/Job")).default;
      const job = await Job.findById(application.jobId);

      if (
        application.userId.toString() !== session.user.id &&
        job.recruiterId.toString() !== session.user.id
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const updateData = await request.json();
    const updatedApplication = await Application.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    return NextResponse.json({ application: updatedApplication });
  } catch (error) {
    console.error("Application update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
