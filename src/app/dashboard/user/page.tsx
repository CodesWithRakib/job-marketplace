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
  User,
  CheckCircle,
  XCircle,
  Hourglass,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-72 mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64 mt-1" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex items-start p-4 border rounded-lg">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-3" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            User Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Welcome back! Here&apos;s an overview of your job search activity.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button asChild className="shadow-sm">
            <Link
              href="/dashboard/user/jobs"
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Find Jobs
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
              {pendingApplications} pending review
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
            <Bookmark className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedJobsCount}</div>
            <p className="text-xs text-muted-foreground">
              Jobs you&apos;re interested in
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recommended Jobs
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
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
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Recent Jobs
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Saved Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    Recent Job Postings
                  </CardTitle>
                  <CardDescription>
                    Latest job opportunities that might interest you
                  </CardDescription>
                </div>
                <Button variant="outline" asChild>
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
                      className="flex items-start p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {job.company}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-3">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.type}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" asChild className="shadow-sm">
                          <Link href={`/dashboard/user/jobs/${job.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="shadow-sm"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <Briefcase className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No recent jobs found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Check back later for new opportunities
                  </p>
                  <Button asChild className="shadow-sm">
                    <Link href="/dashboard/user/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Your Applications
                  </CardTitle>
                  <CardDescription>
                    Track the status of your job applications
                  </CardDescription>
                </div>
                <Button variant="outline" asChild>
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
                      className="flex items-start p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {application.jobTitle}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {application.jobCompany}
                        </p>
                        <div className="flex items-center mt-3">
                          <span
                            className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
                              application.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                : application.status === "reviewed"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : application.status === "accepted"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {application.status === "pending" && (
                              <Hourglass className="h-3 w-3" />
                            )}
                            {application.status === "reviewed" && (
                              <User className="h-3 w-3" />
                            )}
                            {application.status === "accepted" && (
                              <CheckCircle className="h-3 w-3" />
                            )}
                            {application.status === "rejected" && (
                              <XCircle className="h-3 w-3" />
                            )}
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-3 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Applied on{" "}
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="shadow-sm"
                      >
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
                <div className="text-center py-12 px-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No applications yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    You haven&apos;t applied to any jobs yet
                  </p>
                  <Button asChild className="shadow-sm">
                    <Link href="/dashboard/user/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5 text-purple-500" />
                    Saved Jobs
                  </CardTitle>
                  <CardDescription>
                    Jobs you&apos;ve saved for later
                  </CardDescription>
                </div>
                <Button variant="outline" asChild>
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
                      className="flex items-start p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {savedJob.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {savedJob.company}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-3">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            {savedJob.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {savedJob.type}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {savedJob.salary}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" asChild className="shadow-sm">
                          <Link href={`/dashboard/user/jobs/${savedJob.jobId}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="shadow-sm"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <Bookmark className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No saved jobs
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    You haven&apos;t saved any jobs yet
                  </p>
                  <Button asChild className="shadow-sm">
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
