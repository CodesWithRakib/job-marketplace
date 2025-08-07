// app/dashboard/user/applications/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserApplications } from "@/redux/slices/applicationSlice";
import { fetchJobById } from "@/redux/slices/jobSlice";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Filter,
  Eye,
  FileText,
  Calendar,
  Briefcase,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  User,
  ArrowLeft,
  X,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserApplicationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  // Updated to get data from the applications slice
  const {
    entities: applicationEntities,
    views: applicationViews,
    ui: applicationUI,
  } = useSelector((state: RootState) => state.applications);

  // Get job entities from the job slice
  const { entities: jobEntities } = useSelector(
    (state: RootState) => state.jobs
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingJobIds, setLoadingJobIds] = useState<string[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(fetchUserApplications(session.user.id));
    }
  }, [dispatch, session]);

  // Get user applications from entities using views.user
  const userApplications = applicationViews.user.map(
    (id) => applicationEntities[id]
  );

  // Fetch job details for applications if not already loaded
  useEffect(() => {
    const missingJobIds = userApplications
      .filter((application) => !jobEntities[application.jobId])
      .map((application) => application.jobId);

    // Only fetch jobs that aren't already being loaded
    const jobsToFetch = missingJobIds.filter(
      (jobId) => !loadingJobIds.includes(jobId)
    );

    if (jobsToFetch.length > 0) {
      setLoadingJobIds((prev) => [...prev, ...jobsToFetch]);

      jobsToFetch.forEach((jobId) => {
        dispatch(fetchJobById(jobId))
          .unwrap()
          .finally(() => {
            setLoadingJobIds((prev) => prev.filter((id) => id !== jobId));
          });
      });
    }
  }, [userApplications, jobEntities, dispatch, loadingJobIds]);

  // Combine applications with their job details
  const applicationsWithDetails = userApplications
    .map((application) => {
      const jobDetails = jobEntities[application.jobId];
      return {
        ...application,
        jobDetails,
      };
    })
    .filter((item) => item.jobDetails); // Only include items where we have job details

  // Filter applications based on search term and status
  const filteredApplications = applicationsWithDetails?.filter(
    (application) => {
      const matchesSearch =
        application.jobDetails?.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        application.jobDetails?.company
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || application.status === statusFilter;
      return matchesSearch && matchesStatus;
    }
  );

  // Pagination
  const totalPages = Math.ceil(
    (filteredApplications?.length || 0) / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentApplications = filteredApplications?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "reviewed":
        return "default";
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "reviewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "reviewed":
        return <User className="h-3 w-3" />;
      case "accepted":
        return <CheckCircle className="h-3 w-3" />;
      case "rejected":
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            My Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track the status of your job applications
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild className="shadow-sm">
            <Link href="/dashboard/user" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
      <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Application History
          </CardTitle>
          <CardDescription>
            View and track all your job applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                className="pl-10 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status:</span>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 shadow-sm">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {applicationUI.isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                    <TableRow>
                      <TableHead className="font-semibold flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        Job
                      </TableHead>
                      <TableHead className="font-semibold flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        Company
                      </TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Applied
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentApplications?.length ? (
                      currentApplications.map((application) => {
                        const job = application.jobDetails;
                        return (
                          <TableRow
                            key={application.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                          >
                            <TableCell className="font-medium">
                              <div className="font-semibold">{job.title}</div>
                            </TableCell>
                            <TableCell>{job.company}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getStatusBadgeColor(
                                  application.status
                                )}
                              >
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(application.status)}
                                  {application.status.charAt(0).toUpperCase() +
                                    application.status.slice(1)}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-500 dark:text-gray-400">
                              {format(
                                new Date(application.createdAt),
                                "MMM d, yyyy"
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                className="shadow-sm"
                              >
                                <Link
                                  href={`/dashboard/user/applications/${application.id}`}
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="hidden sm:inline">View</span>
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                              <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                              No applications found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
                              You haven&apos;t applied to any jobs yet or no
                              applications match your search criteria.
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSearchTerm("");
                                  setStatusFilter("all");
                                }}
                                className="shadow-sm"
                              >
                                Clear Filters
                              </Button>
                              <Button asChild className="shadow-sm">
                                <Link href="/dashboard/user/jobs">
                                  Browse Jobs
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="shadow-sm"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="shadow-sm"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="shadow-sm"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
