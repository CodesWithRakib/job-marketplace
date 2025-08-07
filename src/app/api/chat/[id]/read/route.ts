import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import Message from "@/schemas/Message";
import Chat from "@/schemas/Chat";
import connectDB from "@/lib/mongodb";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Check if user is part of this chat
    const chat = await Chat.findById(params.id);
    if (!chat || !chat.participants.includes(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Mark all unread messages as read
    await Message.updateMany(
      {
        chat: params.id,
        sender: { $ne: session.user.id },
        readBy: { $ne: session.user.id },
      },
      {
        $push: { readBy: session.user.id },
      }
    );

    return NextResponse.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Mark messages as read error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
