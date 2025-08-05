// app/dashboard/user/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchUserJobs,
  fetchUserApplications,
  fetchSavedJobs,
} from "@/redux/slices/job-slice";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  FileText,
  Bookmark,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userJobs, userApplications, savedJobs, isLoading } = useSelector(
    (state: RootState) => state.jobs
  );
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(fetchUserJobs());
      dispatch(fetchUserApplications(session.user.id));
      dispatch(fetchSavedJobs(session.user.id));
    }
  }, [dispatch, session]);

  // Calculate stats
  const totalApplications = userApplications?.length || 0;
  const pendingApplications =
    userApplications?.filter((app) => app.status === "pending").length || 0;
  const savedJobsCount = savedJobs?.length || 0;
  const recentJobs = userJobs?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here&apos;s an overview of your job search activity.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {pendingApplications} pending review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedJobsCount}</div>
            <p className="text-xs text-muted-foreground">
              Jobs you&apos;re interested in
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recommended Jobs
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentJobs.length}</div>
            <p className="text-xs text-muted-foreground">
              Based on your profile
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Job Postings</CardTitle>
                  <CardDescription>
                    Latest job opportunities that might interest you
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href="/dashboard/user/jobs">View All Jobs</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentJobs.length > 0 ? (
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-start p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.type}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" asChild>
                          <Link href={`/dashboard/user/jobs/${job.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent jobs found</p>
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/user/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Applications</CardTitle>
                  <CardDescription>
                    Track the status of your job applications
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href="/dashboard/user/applications">
                    View All Applications
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {userApplications && userApplications.length > 0 ? (
                <div className="space-y-4">
                  {userApplications.slice(0, 5).map((application) => (
                    <div
                      key={application.id}
                      className="flex items-start p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {application.jobTitle}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {application.jobCompany}
                        </p>
                        <div className="flex items-center mt-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              application.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : application.status === "reviewed"
                                ? "bg-blue-100 text-blue-800"
                                : application.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {application.status}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            Applied on{" "}
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link
                          href={`/dashboard/user/applications/${application.id}`}
                        >
                          View Details
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    You haven&apos;t applied to any jobs yet
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/user/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Saved Jobs</CardTitle>
                  <CardDescription>
                    Jobs you&apos;ve saved for later
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href="/dashboard/user/saved-jobs">
                    View All Saved Jobs
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {savedJobs && savedJobs.length > 0 ? (
                <div className="space-y-4">
                  {savedJobs.slice(0, 5).map((savedJob) => (
                    <div
                      key={savedJob.id}
                      className="flex items-start p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{savedJob.title}</h3>
                        <p className="text-sm text-gray-600">
                          {savedJob.company}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            {savedJob.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {savedJob.type}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {savedJob.salary}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" asChild>
                          <Link href={`/dashboard/user/jobs/${savedJob.jobId}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    You haven&apos;t saved any jobs yet
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/user/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
