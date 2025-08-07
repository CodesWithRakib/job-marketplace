// app/dashboard/user/jobs/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserJobs } from "@/redux/slices/jobSlice";
import { saveJob, unsaveJob } from "@/redux/slices/applicationSlice";
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
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Pagination } from "@/components/common/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeVariant } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";

// Define salary interface based on schema
interface ISalary {
  min: number;
  max: number;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "INR";
  period: "hourly" | "monthly" | "yearly";
}

export default function UserJobsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userJobs, isLoading } = useSelector((state: RootState) => state.jobs);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [salaryMinFilter, setSalaryMinFilter] = useState("");
  const [salaryMaxFilter, setSalaryMaxFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const itemsPerPage = 10;

  // Fix hydration issue by ensuring component is mounted before rendering
  useEffect(() => {
    setIsMounted(true);
    dispatch(fetchUserJobs());
  }, [dispatch]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    locationFilter,
    typeFilter,
    experienceFilter,
    categoryFilter,
    salaryMinFilter,
    salaryMaxFilter,
  ]);

  console.log(userJobs);

  // Filter jobs based on search term and filters
  const filteredJobs = userJobs?.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.tags &&
        job.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesLocation =
      locationFilter === "all" ||
      (locationFilter === "remote" && job.isRemote) ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    const matchesExperience =
      experienceFilter === "all" || job.experience === experienceFilter;
    const matchesCategory =
      categoryFilter === "all" || job.category === categoryFilter;

    // Handle salary filtering - convert salary object to numeric value for comparison
    const extractSalaryValue = (salary: ISalary): number => {
      if (!salary) return 0;
      return salary.max; // Use max value for filtering
    };

    const jobSalaryValue = extractSalaryValue(job.salary);
    const matchesSalaryMin =
      !salaryMinFilter || jobSalaryValue >= parseInt(salaryMinFilter);
    const matchesSalaryMax =
      !salaryMaxFilter || jobSalaryValue <= parseInt(salaryMaxFilter);

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType &&
      matchesExperience &&
      matchesCategory &&
      matchesSalaryMin &&
      matchesSalaryMax
    );
  });

  // Pagination
  const totalPages = Math.ceil((filteredJobs?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSaveJob = async (jobId: string) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to save a job");
      return;
    }
    try {
      if (savedJobs.includes(jobId)) {
        await dispatch(unsaveJob({ userId: session.user.id, jobId })).unwrap();
        setSavedJobs(savedJobs.filter((id) => id !== jobId));
        toast.success("Job removed from saved jobs");
      } else {
        await dispatch(saveJob({ userId: session.user.id, jobId })).unwrap();
        setSavedJobs([...savedJobs, jobId]);
        toast.success("Job saved successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save job");
    }
  };

  const getTypeBadgeVariant = (type: string): BadgeVariant => {
    switch (type) {
      case "full-time":
        return "default";
      case "part-time":
        return "secondary";
      case "contract":
        return "outline";
      case "internship":
        return "destructive";
      case "freelance":
        return "outline";
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
      case "freelance":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Active
          </Badge>
        );
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "filled":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Filled
          </Badge>
        );
      case "closed":
        return <Badge variant="destructive">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format salary for display
  const formatSalary = (salary: ISalary) => {
    if (!salary) return "Negotiable";

    const currencySymbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "C$",
      AUD: "A$",
      INR: "₹",
    };

    const symbol = currencySymbols[salary.currency] || salary.currency;

    if (salary.min === salary.max) {
      return `${symbol}${salary.min.toLocaleString()}/${salary.period}`;
    }

    return `${symbol}${salary.min.toLocaleString()} - ${symbol}${salary.max.toLocaleString()}/${
      salary.period
    }`;
  };

  // Get unique categories for filter
  const categories = [
    ...new Set(userJobs?.map((job) => job.category).filter(Boolean) || []),
  ];

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
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 shadow-sm"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showAdvancedFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {showAdvancedFilters && (
            <Card className="mb-6 border border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Location
                    </label>
                    <Select
                      value={locationFilter}
                      onValueChange={setLocationFilter}
                    >
                      <SelectTrigger className="shadow-sm">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="remote">Remote Only</SelectItem>
                        <SelectItem value="new york">New York</SelectItem>
                        <SelectItem value="san francisco">
                          San Francisco
                        </SelectItem>
                        <SelectItem value="london">London</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Job Type
                    </label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="shadow-sm">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Experience
                    </label>
                    <Select
                      value={experienceFilter}
                      onValueChange={setExperienceFilter}
                    >
                      <SelectTrigger className="shadow-sm">
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Category
                    </label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="shadow-sm">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Min Salary
                    </label>
                    <Input
                      placeholder="e.g. 50000"
                      type="number"
                      className="shadow-sm"
                      value={salaryMinFilter}
                      onChange={(e) => setSalaryMinFilter(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Max Salary
                    </label>
                    <Input
                      placeholder="e.g. 100000"
                      type="number"
                      className="shadow-sm"
                      value={salaryMaxFilter}
                      onChange={(e) => setSalaryMaxFilter(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setLocationFilter("all");
                      setTypeFilter("all");
                      setExperienceFilter("all");
                      setCategoryFilter("all");
                      setSalaryMinFilter("");
                      setSalaryMaxFilter("");
                    }}
                    className="shadow-sm"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
                            <div className="flex flex-col">
                              <div className="font-semibold flex items-center gap-2">
                                {job.title}
                                {job.featured && (
                                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                    <Star className="h-3 w-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {getStatusBadge(job.status)}
                                {job.isRemote && (
                                  <Badge variant="outline">Remote</Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {job.companyLogo ? (
                                <Image
                                  src={job.companyLogo}
                                  alt={`${job.company} logo`}
                                  className="w-6 h-6 rounded"
                                  width={24}
                                  height={24}
                                />
                              ) : (
                                <Building className="h-5 w-5 text-gray-400" />
                              )}
                              <span>{job.company}</span>
                            </div>
                          </TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant={getTypeBadgeVariant(job.type)}
                              className={getTypeBadgeColor(job.type)}
                            >
                              {job.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatSalary(job.salary)}
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
                                className={`shadow-sm ${
                                  savedJobs.includes(job.id)
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : ""
                                }`}
                              >
                                <Bookmark
                                  className={`h-4 w-4 ${
                                    savedJobs.includes(job.id)
                                      ? "fill-current"
                                      : ""
                                  }`}
                                />
                              </Button>
                              <Button size="sm" asChild className="shadow-sm">
                                <Link
                                  href={`/dashboard/user/jobs/${job.id}`}
                                  className="flex items-center gap-1"
                                >
                                  Apply
                                </Link>
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
                                  setExperienceFilter("all");
                                  setCategoryFilter("all");
                                  setSalaryMinFilter("");
                                  setSalaryMaxFilter("");
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
