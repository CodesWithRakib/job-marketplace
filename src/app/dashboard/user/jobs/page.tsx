// app/dashboard/user/jobs/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserJobs } from "@/redux/slices/job-slice";
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
  Bookmark,
  Eye,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Calendar,
  Building,
  X,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Pagination } from "@/components/common/pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserJobsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userJobs, isLoading } = useSelector((state: RootState) => state.jobs);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const itemsPerPage = 10;

  // Fix hydration issue by ensuring component is mounted before rendering
  useEffect(() => {
    setIsMounted(true);
    dispatch(fetchUserJobs());
  }, [dispatch]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationFilter, typeFilter]);

  // Filter jobs based on search term and filters
  const filteredJobs = userJobs?.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      locationFilter === "all" ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil((filteredJobs?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleApplyJob = (jobId: string) => {
    // In a real app, you would navigate to the job details page or open an application modal
    console.log("Applying to job:", jobId);
  };

  const handleSaveJob = (jobId: string) => {
    // In a real app, you would dispatch an action to save the job
    console.log("Saving job:", jobId);
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "full-time":
        return "default";
      case "part-time":
        return "secondary";
      case "contract":
        return "outline";
      case "internship":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "part-time":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "contract":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "internship":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Don't render until component is mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Job Listings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Browse and apply to job opportunities
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild className="shadow-sm">
            <Link href="/dashboard/user" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" />
            Find Your Dream Job
          </CardTitle>
          <CardDescription>
            Search through thousands of job listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or keywords..."
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
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-40 shadow-sm">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="new york">New York</SelectItem>
                  <SelectItem value="san francisco">San Francisco</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-40 shadow-sm">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
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
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-16" />
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
                        Job Title
                      </TableHead>
                      <TableHead className="font-semibold flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        Company
                      </TableHead>
                      <TableHead className="font-semibold flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Location
                      </TableHead>
                      <TableHead className="font-semibold flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Type
                      </TableHead>
                      <TableHead className="font-semibold flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Salary
                      </TableHead>
                      <TableHead className="font-semibold flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Posted
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentJobs?.length ? (
                      currentJobs.map((job) => (
                        <TableRow
                          key={job.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                        >
                          <TableCell className="font-medium">
                            <div className="font-semibold">{job.title}</div>
                          </TableCell>
                          <TableCell>{job.company}</TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getTypeBadgeColor(job.type)}
                            >
                              {job.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {job.salary}
                          </TableCell>
                          <TableCell className="text-gray-500 dark:text-gray-400">
                            {format(new Date(job.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                className="shadow-sm"
                              >
                                <Link
                                  href={`/dashboard/user/jobs/${job.id}`}
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="hidden sm:inline">View</span>
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSaveJob(job.id)}
                                className="shadow-sm"
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApplyJob(job.id)}
                                className="shadow-sm"
                              >
                                Apply
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                              <Briefcase className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                              No jobs found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
                              No jobs match your search criteria. Try adjusting
                              your filters or search terms.
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSearchTerm("");
                                  setLocationFilter("all");
                                  setTypeFilter("all");
                                }}
                                className="shadow-sm"
                              >
                                Clear Filters
                              </Button>
                              <Button asChild className="shadow-sm">
                                <Link href="/dashboard/user">
                                  Back to Dashboard
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
  );
}
