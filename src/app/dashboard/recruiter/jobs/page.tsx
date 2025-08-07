// app/dashboard/recruiter/jobs/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchRecruiterJobs,
  createJob,
  deleteJob,
} from "@/redux/slices/jobSlice";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Briefcase,
  Building,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  FileText,
  DollarSign,
  Loader2,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/common/pagination";

// Define salary interface based on schema
interface ISalary {
  min: number;
  max: number;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "INR";
  period: "hourly" | "monthly" | "yearly";
}

export default function RecruiterJobsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  // Updated to match the store structure
  const {
    entities: jobEntities,
    views: jobViews,
    ui: jobUI,
  } = useSelector((state: RootState) => state.jobs);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const itemsPerPage = 10;

  // Initialize new job form with schema structure
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    description: "",
    responsibilities: [""],
    requirements: [""],
    location: "",
    isRemote: false,
    type: "full-time",
    experience: "mid",
    salary: {
      min: 0,
      max: 0,
      currency: "USD",
      period: "yearly",
    } as ISalary,
    benefits: [""],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    applicationMethod: "platform",
    applicationEmail: "",
    applicationUrl: "",
    status: "active",
    category: "Engineering",
    industry: "",
    tags: [""],
    featured: false,
  });

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(fetchRecruiterJobs(session.user.id));
    }
  }, [dispatch, session]);

  // Get recruiter jobs from entities using views.recruiter
  const recruiterJobs = jobViews.recruiter.map((id) => jobEntities[id]);

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

  // Apply sorting to jobs
  const getSortedJobs = (jobs: any[]) => {
    if (!sortConfig) return jobs;
    return [...jobs].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter jobs based on search term and status
  const filteredJobs = recruiterJobs?.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  const sortedJobs = getSortedJobs(filteredJobs || []);

  // Pagination
  const totalPages = Math.ceil((sortedJobs?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = sortedJobs?.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateJob = () => {
    if (session?.user?.id) {
      // Format responsibilities and requirements as arrays
      const formattedJob = {
        ...newJob,
        responsibilities: newJob.responsibilities.filter(
          (r) => r.trim() !== ""
        ),
        requirements: newJob.requirements.filter((r) => r.trim() !== ""),
        benefits: newJob.benefits.filter((b) => b.trim() !== ""),
        tags: newJob.tags.filter((t) => t.trim() !== ""),
        recruiterId: session.user.id,
        applicationDeadline: new Date(newJob.applicationDeadline),
      };

      dispatch(createJob(formattedJob))
        .unwrap()
        .then(() => {
          toast.success("Job created successfully!");
          setIsCreateDialogOpen(false);
          // Reset form
          setNewJob({
            title: "",
            company: "",
            description: "",
            responsibilities: [""],
            requirements: [""],
            location: "",
            isRemote: false,
            type: "full-time",
            experience: "mid",
            salary: {
              min: 0,
              max: 0,
              currency: "USD",
              period: "yearly",
            } as ISalary,
            benefits: [""],
            applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            applicationMethod: "platform",
            applicationEmail: "",
            applicationUrl: "",
            status: "active",
            category: "Engineering",
            industry: "",
            tags: [""],
            featured: false,
          });
        })
        .catch((error) => {
          toast.error(error.message || "Failed to create job");
        });
    }
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      setIsDeleting(jobId);
      dispatch(deleteJob(jobId))
        .unwrap()
        .then(() => {
          toast.success("Job deleted successfully!");
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete job");
        })
        .finally(() => {
          setIsDeleting(null);
        });
    }
  };

  const handleAddResponsibility = () => {
    setNewJob({
      ...newJob,
      responsibilities: [...newJob.responsibilities, ""],
    });
  };

  const handleRemoveResponsibility = (index: number) => {
    if (newJob.responsibilities.length > 1) {
      const updated = [...newJob.responsibilities];
      updated.splice(index, 1);
      setNewJob({
        ...newJob,
        responsibilities: updated,
      });
    }
  };

  const handleResponsibilityChange = (index: number, value: string) => {
    const updated = [...newJob.responsibilities];
    updated[index] = value;
    setNewJob({
      ...newJob,
      responsibilities: updated,
    });
  };

  const handleAddRequirement = () => {
    setNewJob({
      ...newJob,
      requirements: [...newJob.requirements, ""],
    });
  };

  const handleRemoveRequirement = (index: number) => {
    if (newJob.requirements.length > 1) {
      const updated = [...newJob.requirements];
      updated.splice(index, 1);
      setNewJob({
        ...newJob,
        requirements: updated,
      });
    }
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updated = [...newJob.requirements];
    updated[index] = value;
    setNewJob({
      ...newJob,
      requirements: updated,
    });
  };

  const handleAddBenefit = () => {
    setNewJob({
      ...newJob,
      benefits: [...newJob.benefits, ""],
    });
  };

  const handleRemoveBenefit = (index: number) => {
    if (newJob.benefits.length > 1) {
      const updated = [...newJob.benefits];
      updated.splice(index, 1);
      setNewJob({
        ...newJob,
        benefits: updated,
      });
    }
  };

  const handleBenefitChange = (index: number, value: string) => {
    const updated = [...newJob.benefits];
    updated[index] = value;
    setNewJob({
      ...newJob,
      benefits: updated,
    });
  };

  const handleAddTag = () => {
    setNewJob({
      ...newJob,
      tags: [...newJob.tags, ""],
    });
  };

  const handleRemoveTag = (index: number) => {
    if (newJob.tags.length > 1) {
      const updated = [...newJob.tags];
      updated.splice(index, 1);
      setNewJob({
        ...newJob,
        tags: updated,
      });
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const updated = [...newJob.tags];
    updated[index] = value;
    setNewJob({
      ...newJob,
      tags: updated,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "closed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "closed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3" />;
      case "inactive":
        return <Clock className="h-3 w-3" />;
      case "closed":
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
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

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Jobs Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your job postings and track applications
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0 shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">
                Create New Job
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Fill in the details to create a new job posting.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="title"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  value={newJob.title}
                  onChange={(e) =>
                    setNewJob({ ...newJob, title: e.target.value })
                  }
                  className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="company"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Company
                </Label>
                <Input
                  id="company"
                  value={newJob.company}
                  onChange={(e) =>
                    setNewJob({ ...newJob, company: e.target.value })
                  }
                  className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="location"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  value={newJob.location}
                  onChange={(e) =>
                    setNewJob({ ...newJob, location: e.target.value })
                  }
                  className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="type"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Type
                </Label>
                <Select
                  value={newJob.type}
                  onValueChange={(value) =>
                    setNewJob({ ...newJob, type: value })
                  }
                >
                  <SelectTrigger className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="experience"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Experience
                </Label>
                <Select
                  value={newJob.experience}
                  onValueChange={(value) =>
                    setNewJob({ ...newJob, experience: value })
                  }
                >
                  <SelectTrigger className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="category"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Category
                </Label>
                <Select
                  value={newJob.category}
                  onValueChange={(value) =>
                    setNewJob({ ...newJob, category: value })
                  }
                >
                  <SelectTrigger className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Customer Service">
                      Customer Service
                    </SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Data">Data</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="industry"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Industry
                </Label>
                <Input
                  id="industry"
                  value={newJob.industry}
                  onChange={(e) =>
                    setNewJob({ ...newJob, industry: e.target.value })
                  }
                  className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="currency"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Currency
                </Label>
                <Select
                  value={newJob.salary.currency}
                  onValueChange={(value) =>
                    setNewJob({
                      ...newJob,
                      salary: { ...newJob.salary, currency: value as any },
                    })
                  }
                >
                  <SelectTrigger className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="minSalary"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Min Salary
                </Label>
                <Input
                  id="minSalary"
                  type="number"
                  value={newJob.salary.min}
                  onChange={(e) =>
                    setNewJob({
                      ...newJob,
                      salary: {
                        ...newJob.salary,
                        min: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="maxSalary"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Max Salary
                </Label>
                <Input
                  id="maxSalary"
                  type="number"
                  value={newJob.salary.max}
                  onChange={(e) =>
                    setNewJob({
                      ...newJob,
                      salary: {
                        ...newJob.salary,
                        max: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="period"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Period
                </Label>
                <Select
                  value={newJob.salary.period}
                  onValueChange={(value) =>
                    setNewJob({
                      ...newJob,
                      salary: { ...newJob.salary, period: value as any },
                    })
                  }
                >
                  <SelectTrigger className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="applicationDeadline"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Application Deadline
                </Label>
                <Input
                  id="applicationDeadline"
                  type="date"
                  value={newJob.applicationDeadline}
                  onChange={(e) =>
                    setNewJob({
                      ...newJob,
                      applicationDeadline: e.target.value,
                    })
                  }
                  className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="applicationMethod"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Application Method
                </Label>
                <Select
                  value={newJob.applicationMethod}
                  onValueChange={(value) =>
                    setNewJob({ ...newJob, applicationMethod: value as any })
                  }
                >
                  <SelectTrigger className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Select application method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platform">Platform</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newJob.applicationMethod === "email" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="applicationEmail"
                    className="text-right text-gray-700 dark:text-gray-300"
                  >
                    Application Email
                  </Label>
                  <Input
                    id="applicationEmail"
                    type="email"
                    value={newJob.applicationEmail}
                    onChange={(e) =>
                      setNewJob({ ...newJob, applicationEmail: e.target.value })
                    }
                    className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  />
                </div>
              )}
              {newJob.applicationMethod === "external" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="applicationUrl"
                    className="text-right text-gray-700 dark:text-gray-300"
                  >
                    Application URL
                  </Label>
                  <Input
                    id="applicationUrl"
                    value={newJob.applicationUrl}
                    onChange={(e) =>
                      setNewJob({ ...newJob, applicationUrl: e.target.value })
                    }
                    className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="status"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Status
                </Label>
                <Select
                  value={newJob.status}
                  onValueChange={(value) =>
                    setNewJob({ ...newJob, status: value })
                  }
                >
                  <SelectTrigger className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="featured"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Featured
                </Label>
                <div className="col-span-3 flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newJob.featured}
                    onChange={(e) =>
                      setNewJob({ ...newJob, featured: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="featured">Feature this job posting</label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="isRemote"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Remote
                </Label>
                <div className="col-span-3 flex items-center">
                  <input
                    type="checkbox"
                    id="isRemote"
                    checked={newJob.isRemote}
                    onChange={(e) =>
                      setNewJob({ ...newJob, isRemote: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="isRemote">This is a remote position</label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="description"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newJob.description}
                  onChange={(e) =>
                    setNewJob({ ...newJob, description: e.target.value })
                  }
                  className="col-span-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  rows={3}
                />
              </div>

              {/* Responsibilities */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-gray-700 dark:text-gray-300 pt-2">
                  Responsibilities
                </Label>
                <div className="col-span-3 space-y-2">
                  {newJob.responsibilities.map((resp, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={resp}
                        onChange={(e) =>
                          handleResponsibilityChange(index, e.target.value)
                        }
                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                        placeholder="Responsibility"
                      />
                      {newJob.responsibilities.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveResponsibility(index)}
                          className="p-1 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddResponsibility}
                    className="mt-1"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Responsibility
                  </Button>
                </div>
              </div>

              {/* Requirements */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-gray-700 dark:text-gray-300 pt-2">
                  Requirements
                </Label>
                <div className="col-span-3 space-y-2">
                  {newJob.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={req}
                        onChange={(e) =>
                          handleRequirementChange(index, e.target.value)
                        }
                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                        placeholder="Requirement"
                      />
                      {newJob.requirements.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRequirement(index)}
                          className="p-1 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddRequirement}
                    className="mt-1"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Requirement
                  </Button>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-gray-700 dark:text-gray-300 pt-2">
                  Benefits
                </Label>
                <div className="col-span-3 space-y-2">
                  {newJob.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={benefit}
                        onChange={(e) =>
                          handleBenefitChange(index, e.target.value)
                        }
                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                        placeholder="Benefit"
                      />
                      {newJob.benefits.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBenefit(index)}
                          className="p-1 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddBenefit}
                    className="mt-1"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Benefit
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-gray-700 dark:text-gray-300 pt-2">
                  Tags
                </Label>
                <div className="col-span-3 space-y-2">
                  {newJob.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                        placeholder="Tag"
                      />
                      {newJob.tags.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTag(index)}
                          className="p-1 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTag}
                    className="mt-1"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Tag
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreateJob}
                className="shadow-sm"
              >
                Create Job
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Jobs
            </CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {recruiterJobs?.length || 0}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              All job postings
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Jobs
            </CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {recruiterJobs?.filter((job) => job.status === "active").length ||
                0}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Currently accepting applications
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Applications
            </CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {recruiterJobs?.reduce(
                (sum, job) => sum + (job.applicationCount || 0),
                0
              ) || 0}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Across all job postings
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-500" />
            Your Job Listings
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            View and manage all your job postings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search jobs..."
                className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
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
                <SelectTrigger className="w-full md:w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {jobUI.isLoading ? (
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
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow>
                      <TableHead
                        className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                        onClick={() => requestSort("title")}
                      >
                        <div className="flex items-center gap-1">
                          Job Title {getSortIcon("title")}
                        </div>
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-medium">
                        Company
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-medium">
                        Location
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-medium">
                        Type
                      </TableHead>
                      <TableHead
                        className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                        onClick={() => requestSort("status")}
                      >
                        <div className="flex items-center gap-1">
                          Status {getSortIcon("status")}
                        </div>
                      </TableHead>
                      <TableHead className="text-slate-700 dark:text-slate-300 font-medium">
                        Applications
                      </TableHead>
                      <TableHead
                        className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                        onClick={() => requestSort("createdAt")}
                      >
                        <div className="flex items-center gap-1">
                          Posted {getSortIcon("createdAt")}
                        </div>
                      </TableHead>
                      <TableHead className="text-right text-slate-700 dark:text-slate-300 font-medium">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentJobs?.length ? (
                      currentJobs.map((job) => (
                        <TableRow
                          key={job.id}
                          className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <TableCell className="font-medium text-gray-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              {job.title}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              {job.company}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              {job.location}
                              {job.isRemote && (
                                <Badge variant="outline" className="ml-1">
                                  Remote
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getTypeBadgeColor(job.type)}
                            >
                              {job.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusBadgeColor(job.status)}
                            >
                              <span className="flex items-center gap-1">
                                {getStatusIcon(job.status)}
                                {job.status.charAt(0).toUpperCase() +
                                  job.status.slice(1)}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              {job.applicationCount || 0}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              {format(new Date(job.createdAt), "MMM d, yyyy")}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg"
                              >
                                <DropdownMenuLabel className="text-gray-900 dark:text-white">
                                  Actions
                                </DropdownMenuLabel>
                                <DropdownMenuItem className="text-gray-700 dark:text-gray-300 focus:bg-slate-100 dark:focus:bg-slate-700">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-gray-700 dark:text-gray-300 focus:bg-slate-100 dark:focus:bg-slate-700">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Job
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                                <DropdownMenuItem
                                  className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
                                  onClick={() => handleDeleteJob(job.id)}
                                  disabled={isDeleting === job.id}
                                >
                                  {isDeleting === job.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="mr-2 h-4 w-4" />
                                  )}
                                  Delete Job
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-12 text-gray-500 dark:text-gray-400"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                              <Briefcase className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                              No jobs found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                              No job postings match your search criteria. Try
                              adjusting your filters or create a new job
                              posting.
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
                              <Button
                                onClick={() => setIsCreateDialogOpen(true)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Create Job
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
