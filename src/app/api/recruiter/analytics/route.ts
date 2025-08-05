// app/api/recruiter/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/schemas/Job";
import Application from "@/schemas/Application";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const recruiterId = searchParams.get("recruiterId");
    const timeRange = searchParams.get("timeRange") || "30"; // Default to 30 days

    if (!recruiterId) {
      return NextResponse.json(
        { error: "Recruiter ID is required" },
        { status: 400 }
      );
    }

    // Calculate date based on time range
    const now = new Date();
    const timeRangeDate = new Date();
    timeRangeDate.setDate(now.getDate() - parseInt(timeRange));

    // Fetch job analytics for this recruiter
    const jobs = await Job.find({ recruiterId });
    const activeJobs = await Job.find({
      recruiterId,
      status: "active",
    });
    const newJobs = await Job.find({
      recruiterId,
      createdAt: { $gte: timeRangeDate },
    });

    // Group jobs by creation date for growth data
    const jobGrowth = await Job.aggregate([
      {
        $match: {
          recruiterId,
          createdAt: { $gte: timeRangeDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fetch application analytics for this recruiter's jobs
    const jobIds = jobs.map((job) => job._id);
    const applications = await Application.find({ jobId: { $in: jobIds } });
    const newApplications = await Application.find({
      jobId: { $in: jobIds },
      createdAt: { $gte: timeRangeDate },
    });

    // Group applications by creation date for growth data
    const applicationGrowth = await Application.aggregate([
      {
        $match: {
          jobId: { $in: jobIds },
          createdAt: { $gte: timeRangeDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get application status distribution
    const applicationStatusDistribution = await Application.aggregate([
      {
        $match: {
          jobId: { $in: jobIds },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get top performing jobs (by application count)
    const topJobs = await Job.aggregate([
      { $match: { recruiterId } },
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        },
      },
      {
        $project: {
          id: "$_id",
          title: 1,
          applicationCount: { $size: "$applications" },
          viewCount: "$viewCount", // Assuming you have a viewCount field
        },
      },
      { $sort: { applicationCount: -1 } },
      { $limit: 5 },
    ]);

    return NextResponse.json({
      jobs: {
        total: jobs.length,
        active: activeJobs.length,
        growth: jobGrowth,
      },
      applications: {
        total: applications.length,
        new: newApplications.length,
        growth: applicationGrowth,
      },
      applicationStatusDistribution,
      topJobs,
    });
  } catch (error: any) {
    console.error("Error fetching recruiter analytics:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch recruiter analytics" },
      { status: 500 }
    );
  }
}
