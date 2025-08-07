import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import User from "@/schemas/User";
import connectDB from "@/lib/mongodb";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { status } = await request.json();

    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === session.user.id && status === "inactive") {
      return NextResponse.json(
        { error: "Cannot deactivate your own account" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("User status update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
