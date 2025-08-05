// app/api/recruiter/jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/schemas/Job";
import Application from "@/schemas/Application";
import { getToken } from "next-auth/jwt";

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
