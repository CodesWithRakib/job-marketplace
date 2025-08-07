import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import Chat from "@/schemas/Chat";
import connectDB from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const chats = await Chat.find({
      participants: session.user.id,
    })
      .populate("participants", "name email image")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Chats fetch error:", error);
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
    const { participantId } = await request.json();

    // Check if chat already exists between these users
    const existingChat = await Chat.findOne({
      participants: { $all: [session.user.id, participantId] },
      isGroupChat: false,
    });

    if (existingChat) {
      return NextResponse.json({ chat: existingChat });
    }

    const chat = await Chat.create({
      participants: [session.user.id, participantId],
      isGroupChat: false,
    });

    const populatedChat = await Chat.findById(chat._id).populate(
      "participants",
      "name email image"
    );

    return NextResponse.json({ chat: populatedChat }, { status: 201 });
  } catch (error) {
    console.error("Chat creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
