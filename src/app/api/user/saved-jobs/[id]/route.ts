// app/api/user/saved-jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SavedJob from "@/schemas/SavedJob";
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

    // Find and delete the saved job
    const savedJob = await SavedJob.findOneAndDelete({
      _id: params.id,
      userId: token.id,
    });

    if (!savedJob) {
      return NextResponse.json(
        {
          error:
            "Saved job not found or you don't have permission to delete it",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Job removed from saved jobs",
    });
  } catch (error: any) {
    console.error("Error deleting saved job:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete saved job" },
      { status: 500 }
    );
  }
}
