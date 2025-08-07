import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import Message from "@/schemas/Message";
import Chat from "@/schemas/Chat";
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

    // Check if user is part of this chat
    const chat = await Chat.findById(params.id);
    if (!chat || !chat.participants.includes(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await Message.find({ chat: params.id })
      .populate("sender", "name email image")
      .sort({ createdAt: 1 });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Messages fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const { content, attachments, applicationId } = await request.json();

    const message = await Message.create({
      sender: session.user.id,
      content,
      chat: params.id,
      attachments,
      applicationId,
    });

    // Update lastMessage in chat
    await Chat.findByIdAndUpdate(params.id, { lastMessage: message._id });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name email image"
    );

    return NextResponse.json({ message: populatedMessage }, { status: 201 });
  } catch (error) {
    console.error("Message creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
