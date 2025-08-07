// app/dashboard/recruiter/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchRecruiterAnalytics } from "@/redux/slices/analyticsSlice";
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
  BarChart3,
  Briefcase,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Users,
  Eye,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function RecruiterDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { recruiterAnalytics, isLoading } = useSelector(
    (state: RootState) => state.analytics
  );
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = useState("30");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user?.id && mounted) {
      dispatch(
        fetchRecruiterAnalytics({ recruiterId: session.user.id, timeRange })
      );
    }
  }, [dispatch, session, timeRange, mounted]);

  const handleExportData = () => {
    toast.success("Export functionality would be implemented here");
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!recruiterAnalytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            No analytics data available
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Check back later or contact support if this issue persists.
          </p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const jobGrowthData = recruiterAnalytics.jobs.growth.map((item: any) => ({
    date: item._id,
    jobs: item.count,
  }));

  const applicationGrowthData = recruiterAnalytics.applications.growth.map(
    (item: any) => ({
      date: item._id,
      applications: item.count,
    })
  );

  const applicationStatusDistributionData =
    recruiterAnalytics.applicationStatusDistribution.map((item: any) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
    }));

  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Recruiter Analytics Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                Track your job postings and application trends with
                comprehensive analytics
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Tabs value={timeRange} onValueChange={setTimeRange}>
                <TabsList className="bg-white dark:bg-slate-800 shadow-md">
                  <TabsTrigger
                    value="7"
                    className="data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/30"
                  >
                    Last 7 days
                  </TabsTrigger>
                  <TabsTrigger
                    value="30"
                    className="data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/30"
                  >
                    Last 30 days
                  </TabsTrigger>
                  <TabsTrigger
                    value="90"
                    className="data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/30"
                  >
                    Last 90 days
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                variant="outline"
                onClick={handleExportData}
                className="bg-white dark:bg-slate-800 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900/20 border-green-100 dark:border-green-900/50 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Total Jobs
              </CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Briefcase className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {recruiterAnalytics.jobs.total}
              </div>
              <div className="flex items-center">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                >
                  {recruiterAnalytics.jobs.active} active jobs
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20 border-emerald-100 dark:border-emerald-900/50 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Applications
              </CardTitle>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {recruiterAnalytics.applications.total}
              </div>
              <div className="flex items-center">
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                >
                  {recruiterAnalytics.applications.new} new in the last{" "}
                  {timeRange} days
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-teal-50 dark:from-slate-800 dark:to-teal-900/20 border-teal-100 dark:border-teal-900/50 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Application Rate
              </CardTitle>
              <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                <TrendingUp className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {recruiterAnalytics.jobs.total > 0
                  ? (
                      recruiterAnalytics.applications.total /
                      recruiterAnalytics.jobs.total
                    ).toFixed(1)
                  : "0"}
              </div>
              <div className="flex items-center">
                <Badge
                  variant="secondary"
                  className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
                >
                  Average applications per job
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-lime-50 dark:from-slate-800 dark:to-lime-900/20 border-lime-100 dark:border-lime-900/50 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Top Performing Job
              </CardTitle>
              <div className="p-2 bg-lime-100 dark:bg-lime-900/30 rounded-lg">
                <TrendingUp className="h-4 w-4 text-lime-600 dark:text-lime-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1 truncate">
                {recruiterAnalytics.topJobs?.[0]?.title || "N/A"}
              </div>
              <div className="flex items-center">
                <Badge
                  variant="secondary"
                  className="bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300"
                >
                  {recruiterAnalytics.topJobs?.[0]?.applicationCount || 0}{" "}
                  applications
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-800 shadow-md p-1 rounded-lg w-full inline-flex">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/30 rounded-md"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/30 rounded-md"
            >
              Jobs
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/30 rounded-md"
            >
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                      <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    Job Postings
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Your job postings over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={jobGrowthData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        strokeOpacity={0.3}
                      />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgb(30 41 59)",
                          borderColor: "rgb(51 65 85)",
                          color: "white",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="jobs"
                        stroke="#10b981"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                      <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Application Trends
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Application submissions over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={applicationGrowthData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        strokeOpacity={0.3}
                      />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgb(30 41 59)",
                          borderColor: "rgb(51 65 85)",
                          color: "white",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="applications"
                        stroke="#059669"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-md">
                      <PieChart className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    Application Status Distribution
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Breakdown of application statuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={applicationStatusDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {applicationStatusDistributionData.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgb(30 41 59)",
                          borderColor: "rgb(51 65 85)",
                          color: "white",
                          borderRadius: "0.5rem",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-1.5 bg-lime-100 dark:bg-lime-900/30 rounded-md">
                      <TrendingUp className="h-5 w-5 text-lime-600 dark:text-lime-400" />
                    </div>
                    Top Performing Jobs
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Jobs with the most applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recruiterAnalytics.topJobs.map(
                      (job: any, index: number) => (
                        <div
                          key={job.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-800/50 flex items-center justify-center mr-3">
                              <span className="text-green-800 dark:text-green-200 font-medium text-sm">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {job.title}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {job.applicationCount} applications
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {job.views || 0} views
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                job.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : job.status === "inactive"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }
                            >
                              {job.status}
                            </Badge>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                      <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    Job Postings Trend
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Detailed view of your job postings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={jobGrowthData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        strokeOpacity={0.3}
                      />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgb(30 41 59)",
                          borderColor: "rgb(51 65 85)",
                          color: "white",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="jobs"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                      <Briefcase className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Job Statistics
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Detailed job metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/30 p-4 rounded-lg border border-green-100 dark:border-green-900/50">
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                        Total Jobs
                      </h3>
                      <p className="text-3xl font-bold text-green-800 dark:text-green-200">
                        {recruiterAnalytics.jobs.total}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        {recruiterAnalytics.jobs.active} active jobs
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-800/30 p-4 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                      <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                        New Jobs
                      </h3>
                      <p className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
                        {jobGrowthData.reduce(
                          (sum, item) => sum + item.jobs,
                          0
                        )}
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-300">
                        Posted in the last {timeRange} days
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-800/30 p-4 rounded-lg border border-teal-100 dark:border-teal-900/50">
                      <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-200">
                        Job Growth Rate
                      </h3>
                      <p className="text-3xl font-bold text-teal-800 dark:text-teal-200">
                        {recruiterAnalytics.jobs.total > 0
                          ? (
                              (jobGrowthData.reduce(
                                (sum, item) => sum + item.jobs,
                                0
                              ) /
                                recruiterAnalytics.jobs.total) *
                              100
                            ).toFixed(1)
                          : "0"}
                        %
                      </p>
                      <p className="text-sm text-teal-600 dark:text-teal-300">
                        Growth in the last {timeRange} days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                      <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Application Trends
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Detailed view of application submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={applicationGrowthData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        strokeOpacity={0.3}
                      />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgb(30 41 59)",
                          borderColor: "rgb(51 65 85)",
                          color: "white",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="applications"
                        fill="#059669"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-md">
                      <PieChart className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    Application Status Distribution
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Breakdown of application statuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={applicationStatusDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {applicationStatusDistributionData.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgb(30 41 59)",
                          borderColor: "rgb(51 65 85)",
                          color: "white",
                          borderRadius: "0.5rem",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                    <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Application Statistics
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Detailed application metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/30 p-4 rounded-lg border border-green-100 dark:border-green-900/50">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                      Total Applications
                    </h3>
                    <p className="text-3xl font-bold text-green-800 dark:text-green-200">
                      {recruiterAnalytics.applications.total}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      {recruiterAnalytics.applications.new} new in the last{" "}
                      {timeRange} days
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-800/30 p-4 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                    <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                      Accepted Applications
                    </h3>
                    <p className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
                      {applicationStatusDistributionData.find(
                        (s: any) => s.name === "Accepted"
                      )?.value || 0}
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-300">
                      Successfully hired candidates
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-800/30 p-4 rounded-lg border border-teal-100 dark:border-teal-900/50">
                    <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-200">
                      Application Rate
                    </h3>
                    <p className="text-3xl font-bold text-teal-800 dark:text-teal-200">
                      {recruiterAnalytics.jobs.total > 0
                        ? (
                            recruiterAnalytics.applications.total /
                            recruiterAnalytics.jobs.total
                          ).toFixed(1)
                        : "0"}
                    </p>
                    <p className="text-sm text-teal-600 dark:text-teal-300">
                      Average applications per job
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
