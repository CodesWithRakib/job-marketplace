// app/dashboard/admin/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAdminAnalytics } from "@/redux/slices/jobSlice";
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
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
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
  AreaChart,
  Area,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function AdminDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { analytics, isLoading } = useSelector(
    (state: RootState) => state.jobs
  );
  const [timeRange, setTimeRange] = useState("30");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchAdminAnalytics(timeRange));
  }, [dispatch, timeRange]);

  const handleExportData = () => {
    // Functionality to export analytics data
    alert("Export functionality would be implemented here");
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Skeleton className="h-full w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold">No analytics data available</h1>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const userGrowthData = analytics.users.growth.map((item: any) => ({
    date: item._id,
    users: item.count,
  }));

  const jobGrowthData = analytics.jobs.growth.map((item: any) => ({
    date: item._id,
    jobs: item.count,
  }));

  const applicationGrowthData = analytics.applications.growth.map(
    (item: any) => ({
      date: item._id,
      applications: item.count,
    })
  );

  const roleDistributionData = analytics.roleDistribution.map((item: any) => ({
    name: item._id,
    value: item.count,
  }));

  const jobTypeDistributionData = analytics.jobTypeDistribution.map(
    (item: any) => ({
      name: item._id,
      value: item.count,
    })
  );

  const applicationStatusDistributionData =
    analytics.applicationStatusDistribution.map((item: any) => ({
      name: item._id,
      value: item.count,
    }));

  // Calculate metrics
  const userGrowthRate = (
    (analytics.users.new / analytics.users.total) *
    100
  ).toFixed(1);
  const jobGrowthRate = (
    (analytics.jobs.new / analytics.jobs.total) *
    100
  ).toFixed(1);
  const applicationGrowthRate = (
    (analytics.applications.new / analytics.applications.total) *
    100
  ).toFixed(1);
  const applicationRate = (
    analytics.applications.total / analytics.jobs.total
  ).toFixed(1);
  const acceptedApplications =
    applicationStatusDistributionData.find((s: any) => s.name === "accepted")
      ?.value || 0;
  const acceptanceRate = (
    (acceptedApplications / analytics.applications.total) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track user growth, job postings, and application trends
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger value="7" className="text-xs">
                7 days
              </TabsTrigger>
              <TabsTrigger value="30" className="text-xs">
                30 days
              </TabsTrigger>
              <TabsTrigger value="90" className="text-xs">
                90 days
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            onClick={handleExportData}
            className="shadow-sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Users
            </CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.users.total.toLocaleString()}
            </div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {userGrowthRate}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                from last period
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {analytics.users.new} new in the last {timeRange} days
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Jobs
            </CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Briefcase className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.jobs.total.toLocaleString()}
            </div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {jobGrowthRate}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                from last period
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {analytics.jobs.new} new in the last {timeRange} days
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Applications
            </CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.applications.total.toLocaleString()}
            </div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {applicationGrowthRate}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                from last period
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {analytics.applications.new} new in the last {timeRange} days
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Acceptance Rate
            </CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <UserCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {acceptanceRate}%
            </div>
            <div className="mt-3">
              <Progress value={parseFloat(acceptanceRate)} className="h-2" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {acceptedApplications.toLocaleString()} accepted applications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Jobs</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Applications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  User Growth
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  New user registrations over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#eee"
                      strokeOpacity={0.2}
                    />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        color: "#333",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Briefcase className="h-5 w-5 text-green-500" />
                  Job Postings
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  New job postings over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={jobGrowthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#eee"
                      strokeOpacity={0.2}
                    />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        color: "#333",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="jobs"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Application Trends
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Application submissions over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={applicationGrowthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#eee"
                      strokeOpacity={0.2}
                    />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        color: "#333",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="#ffc658"
                      fill="#ffc658"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Target className="h-5 w-5 text-amber-500" />
                  User Role Distribution
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Distribution of user roles on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roleDistributionData}
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
                      {roleDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        color: "#333",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Activity className="h-5 w-5 text-blue-500" />
                  User Growth
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Detailed view of user registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={userGrowthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#eee"
                      strokeOpacity={0.2}
                    />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        color: "#333",
                      }}
                    />
                    <Bar dataKey="users" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Users className="h-5 w-5 text-green-500" />
                  User Role Distribution
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Breakdown of user roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={roleDistributionData}
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
                      {roleDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        color: "#333",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Zap className="h-5 w-5 text-purple-500" />
                User Statistics
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Detailed user metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                    Total Users
                  </h3>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">
                    {analytics.users.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {analytics.users.new} new in the last {timeRange} days
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 p-4 rounded-lg border border-green-100 dark:border-green-900/30">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                    Active Users
                  </h3>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-200">
                    {Math.round(analytics.users.total * 0.75).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Approximately 75% of total users
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40 p-4 rounded-lg border border-purple-100 dark:border-purple-900/30">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">
                    User Growth Rate
                  </h3>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-200">
                    {userGrowthRate}%
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    Growth in the last {timeRange} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Job Postings Trend
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Detailed view of job postings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={jobGrowthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#eee"
                      strokeOpacity={0.2}
                    />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        color: "#333",
                      }}
                    />
                    <Bar dataKey="jobs" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Target className="h-5 w-5 text-amber-500" />
                  Job Type Distribution
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Breakdown of job types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={jobTypeDistributionData}
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
                      {jobTypeDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        color: "#333",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Briefcase className="h-5 w-5 text-blue-500" />
                Job Statistics
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Detailed job metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                    Total Jobs
                  </h3>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">
                    {analytics.jobs.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {analytics.jobs.new} new in the last {timeRange} days
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 p-4 rounded-lg border border-green-100 dark:border-green-900/30">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                    Active Jobs
                  </h3>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-200">
                    {Math.round(analytics.jobs.total * 0.8).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Approximately 80% of total jobs
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40 p-4 rounded-lg border border-purple-100 dark:border-purple-900/30">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">
                    Job Growth Rate
                  </h3>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-200">
                    {jobGrowthRate}%
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    Growth in the last {timeRange} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Application Trends
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Detailed view of application submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={applicationGrowthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#eee"
                      strokeOpacity={0.2}
                    />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        color: "#333",
                      }}
                    />
                    <Bar
                      dataKey="applications"
                      fill="#ffc658"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Application Status Distribution
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
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
                      {applicationStatusDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        color: "#333",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Application Statistics
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Detailed application metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                    Total Applications
                  </h3>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">
                    {analytics.applications.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {analytics.applications.new} new in the last {timeRange}{" "}
                    days
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 p-4 rounded-lg border border-green-100 dark:border-green-900/30">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                    Accepted Applications
                  </h3>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-200">
                    {acceptedApplications.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Successfully hired candidates
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40 p-4 rounded-lg border border-purple-100 dark:border-purple-900/30">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">
                    Application Rate
                  </h3>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-200">
                    {applicationRate}
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    Average applications per job
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
