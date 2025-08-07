// app/dashboard/recruiter/analytics/page.tsx
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
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
import { toast } from "sonner";

export default function RecruiterAnalytics() {
  const dispatch = useDispatch<AppDispatch>();
  const { recruiterAnalytics, isLoading } = useSelector(
    (state: RootState) => state.analytics
  );
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = useState("monthly");
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!recruiterAnalytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
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

  // Prepare data for charts from the API response
  const applicationSources =
    recruiterAnalytics.applicationSources?.map((source: any) => ({
      name: source._id,
      value: source.count,
      color:
        source._id === "Job Boards"
          ? "bg-blue-500"
          : source._id === "Company Website"
          ? "bg-green-500"
          : source._id === "Referrals"
          ? "bg-purple-500"
          : "bg-yellow-500",
    })) || [];

  const hiringFunnel =
    recruiterAnalytics.hiringFunnel?.map((stage: any) => ({
      stage: stage._id,
      count: stage.count,
      percentage: stage.percentage,
      color:
        stage._id === "Applied"
          ? "bg-blue-500"
          : stage._id === "Screened"
          ? "bg-green-500"
          : stage._id === "Interview"
          ? "bg-purple-500"
          : stage._id === "Offer"
          ? "bg-yellow-500"
          : "bg-green-600",
    })) || [];

  const timeToHire = {
    average: recruiterAnalytics.timeToHire?.average || 24,
    fastest: recruiterAnalytics.timeToHire?.fastest || {
      days: 7,
      role: "Frontend Developer",
    },
    slowest: recruiterAnalytics.timeToHire?.slowest || {
      days: 42,
      role: "Senior Developer",
    },
    industry: recruiterAnalytics.timeToHire?.industry || {
      days: 30,
      sector: "Tech Industry",
    },
  };

  // Calculate key metrics from the API response
  const keyMetrics = [
    {
      title: "Total Applications",
      value: recruiterAnalytics.applications?.total?.toLocaleString() || "0",
      change: recruiterAnalytics.applications?.growthPercentage
        ? `+${recruiterAnalytics.applications.growthPercentage}%`
        : "+0%",
      icon: Users,
      trend:
        recruiterAnalytics.applications?.growthPercentage >= 0 ? "up" : "down",
    },
    {
      title: "Interview Rate",
      value: `${recruiterAnalytics.interviewRate || 0}%`,
      change: recruiterAnalytics.interviewRateGrowth
        ? `+${recruiterAnalytics.interviewRateGrowth}%`
        : "+0%",
      icon: Briefcase,
      trend: (recruiterAnalytics.interviewRateGrowth || 0) >= 0 ? "up" : "down",
    },
    {
      title: "Offer Acceptance",
      value: `${recruiterAnalytics.offerAcceptanceRate || 0}%`,
      change: recruiterAnalytics.offerAcceptanceRateGrowth
        ? `${recruiterAnalytics.offerAcceptanceRateGrowth >= 0 ? "+" : ""}${
            recruiterAnalytics.offerAcceptanceRateGrowth
          }%`
        : "-3%",
      icon: CheckCircle,
      trend:
        (recruiterAnalytics.offerAcceptanceRateGrowth || 0) >= 0
          ? "up"
          : "down",
    },
    {
      title: "Time to Hire",
      value: `${timeToHire.average} days`,
      change: recruiterAnalytics.timeToHireImprovement
        ? `-${recruiterAnalytics.timeToHireImprovement} days`
        : "-4 days",
      icon: Clock,
      trend:
        (recruiterAnalytics.timeToHireImprovement || 0) >= 0 ? "up" : "down",
    },
  ];

  // Prepare data for charts
  const applicationGrowthData =
    recruiterAnalytics.applicationGrowth?.map((item: any) => ({
      date: item._id,
      applications: item.count,
    })) || [];

  const hireTimeData =
    recruiterAnalytics.hireTimeDistribution?.map((item: any) => ({
      range: item._id,
      count: item.count,
    })) || [];

  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Recruitment Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track your recruitment performance and optimize your hiring process
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Time Range:</span>
          </div>
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger value="weekly" className="text-xs">
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="quarterly" className="text-xs">
                Quarterly
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="shadow-sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card
            key={index}
            className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">{metric.value}</p>
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    metric.trend === "up"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  <metric.icon
                    className={`h-5 w-5 ${
                      metric.trend === "up"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  />
                </div>
              </div>
              <div className="flex items-center mt-3">
                {metric.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    metric.trend === "up"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Sources */}
        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Application Sources
            </CardTitle>
            <CardDescription>
              Where your candidates are coming from
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {applicationSources.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{source.name}</span>
                  <Badge variant="outline" className="ml-2">
                    {source.value}%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${source.color}`}
                    style={{ width: `${source.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Hiring Funnel */}
        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Hiring Funnel
            </CardTitle>
            <CardDescription>
              Conversion rates through your hiring process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {hiringFunnel.map((stage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stage.count}</span>
                    <Badge variant="outline">{stage.percentage}%</Badge>
                  </div>
                </div>
                <Progress value={stage.percentage} className="h-2.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Application Growth Chart */}
      <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Application Growth
          </CardTitle>
          <CardDescription>Application trends over time</CardDescription>
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
                stroke="#10b981"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Time to Hire */}
      <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-500" />
            Time to Hire
          </CardTitle>
          <CardDescription>
            How long it takes to fill positions in your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Average Time to Hire</span>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {timeToHire.average} days
              </Badge>
            </div>
            <Progress value={60} className="h-3" />
            <div className="flex justify-between mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span>0 days</span>
              <span>40 days</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-sm border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Fastest Hire
                </p>
                <p className="text-2xl font-bold mt-1">
                  {timeToHire.fastest.days} days
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {timeToHire.fastest.role}
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Slowest Hire
                </p>
                <p className="text-2xl font-bold mt-1">
                  {timeToHire.slowest.days} days
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {timeToHire.slowest.role}
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Industry Average
                </p>
                <p className="text-2xl font-bold mt-1">
                  {timeToHire.industry.days} days
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {timeToHire.industry.sector}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Hire Time Distribution */}
      <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Hire Time Distribution
          </CardTitle>
          <CardDescription>
            Distribution of time taken to fill positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hireTimeData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                strokeOpacity={0.3}
              />
              <XAxis dataKey="range" stroke="#94a3b8" />
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
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
