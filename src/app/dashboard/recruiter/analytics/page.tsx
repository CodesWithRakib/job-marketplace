// app/dashboard/recruiter/analytics/page.tsx
"use client";
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
} from "lucide-react";
import { useState } from "react";

export default function RecruiterAnalytics() {
  const [timeRange, setTimeRange] = useState("monthly");

  // Mock data for analytics
  const applicationSources = [
    { name: "Job Boards", value: 45, color: "bg-blue-500" },
    { name: "Company Website", value: 30, color: "bg-green-500" },
    { name: "Referrals", value: 15, color: "bg-purple-500" },
    { name: "Social Media", value: 10, color: "bg-yellow-500" },
  ];

  const hiringFunnel = [
    { stage: "Applied", count: 120, percentage: 100, color: "bg-blue-500" },
    { stage: "Screened", count: 72, percentage: 60, color: "bg-green-500" },
    { stage: "Interview", count: 36, percentage: 30, color: "bg-purple-500" },
    { stage: "Offer", count: 18, percentage: 15, color: "bg-yellow-500" },
    { stage: "Hired", count: 12, percentage: 10, color: "bg-green-600" },
  ];

  const timeToHire = {
    average: 24,
    fastest: { days: 7, role: "Frontend Developer" },
    slowest: { days: 42, role: "Senior Developer" },
    industry: { days: 30, sector: "Tech Industry" },
  };

  const keyMetrics = [
    {
      title: "Total Applications",
      value: "1,240",
      change: "+12%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Interview Rate",
      value: "32%",
      change: "+5%",
      icon: Briefcase,
      trend: "up",
    },
    {
      title: "Offer Acceptance",
      value: "78%",
      change: "-3%",
      icon: CheckCircle,
      trend: "down",
    },
    {
      title: "Time to Hire",
      value: "24 days",
      change: "-4 days",
      icon: Clock,
      trend: "up",
    },
  ];

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
    </div>
  );
}
