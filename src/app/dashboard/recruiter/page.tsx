// app/dashboard/recruiter/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchRecruiterJobs,
  fetchRecruiterApplications,
  deleteJob,
} from "@/redux/slices/job-slice";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Briefcase,
  FileText,
  CheckCircle,
  AlertCircle,
  Settings,
  BarChart3,
  Activity,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function RecruiterDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const { recruiterJobs, recruiterApplications, isLoading } = useSelector(
    (state: RootState) => state.jobs
  );
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(fetchRecruiterJobs(session.user.id));
      dispatch(fetchRecruiterApplications(session.user.id));
    }
  }, [dispatch, session]);

  // Calculate stats from actual data
  const totalJobs = recruiterJobs?.length || 0;
  const activeJobs =
    recruiterJobs?.filter((job) => job.status === "active").length || 0;
  const totalApplications = recruiterApplications?.length || 0;
  const pendingApplications =
    recruiterApplications?.filter((app) => app.status === "pending").length ||
    0;

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await dispatch(deleteJob(jobId));
      if (session?.user?.id) {
        dispatch(fetchRecruiterJobs(session.user.id));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your jobs and applications
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={session?.user?.image || ""}
              alt={session?.user?.name}
            />
            <AvatarFallback>
              {session?.user?.name?.charAt(0).toUpperCase() || "R"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{session?.user?.name || "Recruiter"}</p>
            <p className="text-sm text-gray-500">Recruiter</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">Posted jobs</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">Total applications</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Need review</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">My Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Application Stats
                </CardTitle>
                <CardDescription>Application status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Pending</span>
                    <Badge variant="secondary">{pendingApplications}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reviewed</span>
                    <Badge variant="outline">
                      {recruiterApplications?.filter(
                        (app) => app.status === "reviewed"
                      ).length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Accepted</span>
                    <Badge variant="default">
                      {recruiterApplications?.filter(
                        (app) => app.status === "accepted"
                      ).length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rejected</span>
                    <Badge variant="destructive">
                      {recruiterApplications?.filter(
                        (app) => app.status === "rejected"
                      ).length || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest applications and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recruiterApplications?.slice(0, 3).map((application) => (
                    <div
                      key={application.id}
                      className="flex items-start space-x-3"
                    >
                      {application.status === "pending" && (
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      )}
                      {application.status === "accepted" && (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      )}
                      {application.status === "rejected" && (
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          New application for {application.jobTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          {application.userName} •{" "}
                          {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for recruiters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard/recruiter/post-job">
                  <Button className="w-full h-20 flex flex-col gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Post New Job</span>
                  </Button>
                </Link>
                <Link href="/dashboard/recruiter/applications">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Review Applications</span>
                  </Button>
                </Link>
                <Link href="/dashboard/recruiter/messages">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Messages</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">My Jobs</h2>
            <Link href="/dashboard/recruiter/post-job">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Post New Job
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recruiterJobs?.map((job) => (
                    <tr key={job.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {job.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {job.company}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline">{job.type}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            job.status === "active" ? "default" : "secondary"
                          }
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.applicationCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link href={`/dashboard/recruiter/jobs/${job.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link
                            href={`/dashboard/recruiter/jobs/${job.id}/edit`}
                          >
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Applications</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export CSV
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recruiterApplications?.map((application) => (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage
                              src={application.userImage || ""}
                              alt={application.userName}
                            />
                            <AvatarFallback>
                              {application.userName?.charAt(0).toUpperCase() ||
                                "C"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {application.userName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.userEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {application.jobTitle}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.jobCompany}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            application.status === "pending"
                              ? "secondary"
                              : application.status === "accepted"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {application.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/recruiter/applications/${application.id}`}
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link
                            href={`/dashboard/recruiter/messages/${application.userId}`}
                          >
                            <Button variant="outline" size="sm">
                              Message
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
