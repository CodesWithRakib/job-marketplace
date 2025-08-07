import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import User from "@/schemas/User";
import Job from "@/schemas/Job";
import Application from "@/schemas/Application";
import connectDB from "@/lib/mongodb";
import { startOfDay, subDays } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30";
    const days = parseInt(timeRange);
    const startDate = startOfDay(subDays(new Date(), days));

    await connectDB();

    // User analytics
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate },
    });

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // Job analytics
    const totalJobs = await Job.countDocuments();
    const newJobs = await Job.countDocuments({
      createdAt: { $gte: startDate },
    });

    const jobGrowth = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const jobTypeDistribution = await Job.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    // Application analytics
    const totalApplications = await Application.countDocuments();
    const newApplications = await Application.countDocuments({
      createdAt: { $gte: startDate },
    });

    const applicationGrowth = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const applicationStatusDistribution = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const analytics = {
      users: {
        total: totalUsers,
        new: newUsers,
        growth: userGrowth,
      },
      jobs: {
        total: totalJobs,
        new: newJobs,
        growth: jobGrowth,
      },
      applications: {
        total: totalApplications,
        new: newApplications,
        growth: applicationGrowth,
      },
      roleDistribution,
      jobTypeDistribution,
      applicationStatusDistribution,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
