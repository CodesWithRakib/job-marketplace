import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import SavedJob from "@/schemas/SavedJob";
import connectDB from "@/lib/mongodb";

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
    const savedJob = await SavedJob.findById(params.id);

    if (!savedJob) {
      return NextResponse.json(
        { error: "Saved job not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to update this saved job
    if (savedJob.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { notes } = await request.json();
    const updatedSavedJob = await SavedJob.findByIdAndUpdate(
      params.id,
      { notes },
      { new: true }
    );

    return NextResponse.json({ savedJob: updatedSavedJob });
  } catch (error) {
    console.error("Saved job update error:", error);
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
    const savedJob = await SavedJob.findById(params.id);

    if (!savedJob) {
      return NextResponse.json(
        { error: "Saved job not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to delete this saved job
    if (savedJob.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await SavedJob.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Saved job removed" });
  } catch (error) {
    console.error("Saved job deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
