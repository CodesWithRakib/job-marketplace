import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import Job from "@/schemas/Job";
import Application from "@/schemas/Application";
import connectDB from "@/lib/mongodb";
import { startOfDay, subDays } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== "recruiter" && session.user.role !== "admin")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30";
    const recruiterId = searchParams.get("recruiterId");
    const days = parseInt(timeRange);
    const startDate = startOfDay(subDays(new Date(), days));
    const targetRecruiterId = recruiterId || session.user.id;

    await connectDB();

    // Job analytics
    const totalJobs = await Job.countDocuments({
      recruiterId: targetRecruiterId,
    });
    const activeJobs = await Job.countDocuments({
      recruiterId: targetRecruiterId,
      status: "active",
    });

    const jobGrowth = await Job.aggregate([
      {
        $match: {
          recruiterId: targetRecruiterId,
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

    // Application analytics
    const jobs = await Job.find({ recruiterId: targetRecruiterId });
    const jobIds = jobs.map((job) => job._id);

    const totalApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
    });

    const newApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
      createdAt: { $gte: startDate },
    });

    const applicationGrowth = await Application.aggregate([
      {
        $match: {
          jobId: { $in: jobIds },
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

    // Top jobs by application count
    const topJobs = await Job.aggregate([
      {
        $match: {
          recruiterId: targetRecruiterId,
        },
      },
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
          viewCount: "$views",
        },
      },
      {
        $sort: { applicationCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const analytics = {
      jobs: {
        total: totalJobs,
        active: activeJobs,
        growth: jobGrowth,
      },
      applications: {
        total: totalApplications,
        new: newApplications,
        growth: applicationGrowth,
      },
      applicationStatusDistribution,
      topJobs,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Recruiter analytics fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
