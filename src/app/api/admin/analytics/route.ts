// app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/schemas/User";
import Job from "@/schemas/Job";
import Application from "@/schemas/Application";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get query parameters for time range
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30"; // Default to 30 days

    // Calculate date based on time range
    const now = new Date();
    const timeRangeDate = new Date();
    timeRangeDate.setDate(now.getDate() - parseInt(timeRange));

    // Fetch user analytics
    const users = await User.find({});
    const newUsers = await User.find({ createdAt: { $gte: timeRangeDate } });

    // Group users by creation date for growth data
    const userGrowth = await User.aggregate([
      {
        $match: {
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

    // Fetch job analytics
    const jobs = await Job.find({});
    const newJobs = await Job.find({ createdAt: { $gte: timeRangeDate } });

    // Group jobs by creation date for growth data
    const jobGrowth = await Job.aggregate([
      {
        $match: {
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

    // Fetch application analytics
    const applications = await Application.find({});
    const newApplications = await Application.find({
      createdAt: { $gte: timeRangeDate },
    });

    // Group applications by creation date for growth data
    const applicationGrowth = await Application.aggregate([
      {
        $match: {
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

    // Get role distribution
    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get job type distribution
    const jobTypeDistribution = await Job.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get application status distribution
    const applicationStatusDistribution = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      users: {
        total: users.length,
        new: newUsers.length,
        growth: userGrowth,
      },
      jobs: {
        total: jobs.length,
        new: newJobs.length,
        growth: jobGrowth,
      },
      applications: {
        total: applications.length,
        new: newApplications.length,
        growth: applicationGrowth,
      },
      roleDistribution,
      jobTypeDistribution,
      applicationStatusDistribution,
    });
  } catch (error: any) {
    console.error("Error fetching admin analytics:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch admin analytics" },
      { status: 500 }
    );
  }
}
