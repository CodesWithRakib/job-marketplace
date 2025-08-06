// app/api/recruiter/jobs/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/schemas/Job";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.id || token.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const status = searchParams.get("status") || "";
    const type = searchParams.get("type") || "";
    const location = searchParams.get("location") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery: any = { recruiterId: token.id };

    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { company: { $regex: query, $options: "i" } },
      ];
    }

    if (status) {
      searchQuery.status = status;
    }

    if (type) {
      searchQuery.type = type;
    }

    if (location) {
      searchQuery.location = { $regex: location, $options: "i" };
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get jobs with search, filters, and pagination
    const jobs = await Job.find(searchQuery).sort(sort).skip(skip).limit(limit);

    // Get total count for pagination
    const total = await Job.countDocuments(searchQuery);

    return NextResponse.json({
      jobs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      filters: {
        query,
        status,
        type,
        location,
        sortBy,
        sortOrder,
      },
    });
  } catch (error: any) {
    console.error("Error searching jobs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search jobs" },
      { status: 500 }
    );
  }
}
