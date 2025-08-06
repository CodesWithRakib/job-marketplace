// app/dashboard/recruiter/applications/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchRecruiterApplications } from "@/redux/slices/job-slice";
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
  MoreHorizontal,
  Eye,
  Download,
  Check,
  X,
  User,
  Briefcase,
  FileText,
  Calendar,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Hourglass,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "sonner";
import { Pagination } from "@/components/common/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function RecruiterApplicationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { recruiterApplications, isLoading } = useSelector(
    (state: RootState) => state.jobs
  );
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user?.id && mounted) {
      dispatch(fetchRecruiterApplications(session.user.id));
    }
  }, [dispatch, session, mounted]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Sorting function
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to applications
  const getSortedApplications = (applications: any[]) => {
    if (!sortConfig) return applications;

    return [...applications].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter applications based on search term and status
  const filteredApplications = recruiterApplications?.filter((application) => {
    const matchesSearch =
      application.userId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      application.jobId?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      application.jobId?.company
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || application.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  const sortedApplications = getSortedApplications(filteredApplications || []);

  // Pagination
  const totalPages = Math.ceil(
    (sortedApplications?.length || 0) / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentApplications = sortedApplications?.slice(
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
        return <Hourglass className="h-3 w-3" />;
      case "reviewed":
        return <UserCheck className="h-3 w-3" />;
      case "accepted":
        return <CheckCircle className="h-3 w-3" />;
      case "rejected":
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleUpdateStatus = (applicationId: string, newStatus: string) => {
    console.log(`Updating application ${applicationId} to status ${newStatus}`);
    toast.success(`Application status updated to ${newStatus}`);
  };

  const handleExportApplications = () => {
    toast.success("Export functionality would be implemented here");
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rounded-xl">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Applications Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                Manage and review applications to your job postings with our
                comprehensive tools
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleExportApplications}
              className="bg-white dark:bg-slate-800 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/20 border-blue-100 dark:border-blue-900/50 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Total Applications
              </CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {recruiterApplications?.length || 0}
              </div>
              <div className="flex items-center">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  All time
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900/20 border-green-100 dark:border-green-900/50 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Pending Review
              </CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <User className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {recruiterApplications?.filter(
                  (app) => app.status === "pending"
                ).length || 0}
              </div>
              <div className="flex items-center">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                >
                  Awaiting action
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20 border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Accepted
              </CardTitle>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {recruiterApplications?.filter(
                  (app) => app.status === "accepted"
                ).length || 0}
              </div>
              <div className="flex items-center">
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                >
                  Successful candidates
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Application List
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              View and manage all applications to your job postings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Search applications..."
                  className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
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

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-48" />
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
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                      <TableRow>
                        <TableHead
                          className="text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                          onClick={() => requestSort("userId.name")}
                        >
                          <div className="flex items-center gap-1">
                            Applicant {getSortIcon("userId.name")}
                          </div>
                        </TableHead>
                        <TableHead
                          className="text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                          onClick={() => requestSort("jobId.title")}
                        >
                          <div className="flex items-center gap-1">
                            Job {getSortIcon("jobId.title")}
                          </div>
                        </TableHead>
                        <TableHead className="text-slate-600 dark:text-slate-300 font-medium">
                          Company
                        </TableHead>
                        <TableHead
                          className="text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                          onClick={() => requestSort("status")}
                        >
                          <div className="flex items-center gap-1">
                            Status {getSortIcon("status")}
                          </div>
                        </TableHead>
                        <TableHead
                          className="text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                          onClick={() => requestSort("createdAt")}
                        >
                          <div className="flex items-center gap-1">
                            Applied {getSortIcon("createdAt")}
                          </div>
                        </TableHead>
                        <TableHead className="text-right text-slate-600 dark:text-slate-300 font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentApplications?.length ? (
                        currentApplications.map((application) => (
                          <TableRow
                            key={application.id}
                            className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <TableCell className="font-medium text-slate-900 dark:text-white">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={application.userId?.profileImage}
                                    alt={application.userId?.name}
                                  />
                                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    {application.userId?.name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {application.userId?.name}
                                  </div>
                                  <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {application.userId?.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-900 dark:text-white">
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                {application.jobId?.title}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-900 dark:text-white">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                {application.jobId?.company}
                              </div>
                            </TableCell>
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
                            <TableCell className="text-slate-900 dark:text-white">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                {format(
                                  new Date(application.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg"
                                >
                                  <DropdownMenuLabel className="text-slate-900 dark:text-white">
                                    Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem className="text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-700">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateStatus(
                                        application.id,
                                        "reviewed"
                                      )
                                    }
                                    className="text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-700"
                                  >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Mark as Reviewed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateStatus(
                                        application.id,
                                        "accepted"
                                      )
                                    }
                                    className="text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-700"
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Accept Application
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateStatus(
                                        application.id,
                                        "rejected"
                                      )
                                    }
                                    className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
                                  >
                                    <UserX className="mr-2 h-4 w-4" />
                                    Reject Application
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-12 text-slate-500 dark:text-slate-400"
                          >
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <AlertCircle className="h-8 w-8 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                No applications found
                              </h3>
                              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                No applications match your search criteria. Try
                                adjusting your filters or search terms.
                              </p>
                              <div className="flex gap-2 mt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                  }}
                                >
                                  Clear Filters
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
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    className="mt-6"
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
