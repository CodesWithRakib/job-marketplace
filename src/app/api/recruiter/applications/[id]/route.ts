// app/api/recruiter/applications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/schemas/Application";
import Job from "@/schemas/Job";
import { getToken } from "next-auth/jwt";

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

    // Find the application and populate related data
    const application = await Application.findById(params.id)
      .populate("userId", "name email image resume skills")
      .populate("jobId", "title company location type salary");

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Verify this application belongs to a job owned by this recruiter
    const job = await Job.findById(application.jobId);
    if (!job || job.recruiterId.toString() !== token.id) {
      return NextResponse.json(
        { error: "You don't have permission to access this application" },
        { status: 403 }
      );
    }

    return NextResponse.json({ application });
  } catch (error: any) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch application" },
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

    const { status, notes } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the application
    const application = await Application.findById(params.id);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Verify this application belongs to a job owned by this recruiter
    const job = await Job.findById(application.jobId);
    if (!job || job.recruiterId.toString() !== token.id) {
      return NextResponse.json(
        { error: "You don't have permission to update this application" },
        { status: 403 }
      );
    }

    // Update the application
    const updateData: any = { status };
    if (notes !== undefined) updateData.notes = notes;

    const updatedApplication = await Application.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )
      .populate("userId", "name email")
      .populate("jobId", "title company");

    return NextResponse.json({
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error: any) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update application" },
      { status: 500 }
    );
  }
}
