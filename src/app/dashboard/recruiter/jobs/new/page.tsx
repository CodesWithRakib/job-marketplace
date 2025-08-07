// app/dashboard/recruiter/post-job/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createJob } from "@/redux/slices/jobSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Loader2,
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  X,
  Plus,
  Tag,
  FileText,
  ArrowLeft,
  Globe,
  Users,
  Target,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define salary interface based on schema
interface ISalary {
  min: number;
  max: number;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "INR";
  period: "hourly" | "monthly" | "yearly";
}

const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  companyLogo: z.string().optional(),
  companyWebsite: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  responsibilities: z
    .array(z.string().min(1, "Responsibility cannot be empty"))
    .min(1, "At least one responsibility is required"),
  requirements: z
    .array(z.string().min(1, "Requirement cannot be empty"))
    .min(1, "At least one requirement is required"),
  location: z.string().min(1, "Location is required"),
  isRemote: z.boolean().default(false),
  type: z.enum([
    "full-time",
    "part-time",
    "contract",
    "internship",
    "freelance",
  ]),
  experience: z.enum(["entry", "mid", "senior", "executive"]),
  salary: z.object({
    min: z.number().min(0, "Minimum salary must be a positive number"),
    max: z.number().min(0, "Maximum salary must be a positive number"),
    currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD", "INR"]).default("USD"),
    period: z.enum(["hourly", "monthly", "yearly"]).default("yearly"),
  }),
  benefits: z.array(z.string().min(1, "Benefit cannot be empty")).optional(),
  applicationDeadline: z.string().min(1, "Application deadline is required"),
  applicationMethod: z
    .enum(["platform", "email", "external"]) // Changed from "url" to "external"
    .default("platform"),
  applicationEmail: z.string().optional(),
  applicationUrl: z.string().optional(),
  status: z
    .enum(["draft", "active", "inactive", "filled", "closed"])
    .default("draft"),
  category: z.enum([
    "Engineering",
    "Design",
    "Marketing",
    "Sales",
    "Customer Service",
    "Operations",
    "Finance",
    "HR",
    "Data",
    "Product",
    "Other",
  ]),
  industry: z.string().min(1, "Industry is required"),
  tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
  featured: z.boolean().default(false),
  promotedUntil: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  // Redirect if not authenticated or not a recruiter
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "recruiter") {
      toast.error("You don't have permission to access this page");
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      type: "full-time",
      status: "draft",
      isRemote: false,
      salary: {
        currency: "USD",
        period: "yearly",
        min: 0,
        max: 0,
      },
      benefits: [],
      responsibilities: [""],
      requirements: [""],
      tags: [""],
    },
  });

  // Use useFieldArray for managing dynamic arrays
  const {
    fields: responsibilityFields,
    append: appendResponsibility,
    remove: removeResponsibility,
  } = useFieldArray({
    control,
    name: "responsibilities",
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "requirements",
  });

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control,
    name: "benefits",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const watchedType = watch("type");
  const watchedStatus = watch("status");
  const watchedIsRemote = watch("isRemote");
  const watchedApplicationMethod = watch("applicationMethod");
  const watchedSalaryCurrency = watch("salary.currency");

  const handleKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      callback();
    }
  };

  const onSubmit = async (data: JobFormData) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to post a job");
      return;
    }

    setIsSubmitting(true);
    try {
      // Filter out empty strings from arrays
      const filteredData = {
        ...data,
        responsibilities: data.responsibilities.filter((r) => r.trim() !== ""),
        requirements: data.requirements.filter((r) => r.trim() !== ""),
        benefits: data.benefits?.filter((b) => b.trim() !== "") || [],
        tags: data.tags?.filter((t) => t.trim() !== "") || [],
        applicationDeadline: new Date(data.applicationDeadline),
        promotedUntil: data.promotedUntil
          ? new Date(data.promotedUntil)
          : undefined,
      };

      await dispatch(
        createJob({
          ...filteredData,
          recruiterId: session.user.id,
        })
      ).unwrap();
      toast.success("Job posted successfully!");
      router.push("/dashboard/recruiter/jobs");
    } catch (error: any) {
      toast.error(error.message || "Failed to post job");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="max-w-3xl mx-auto flex justify-center items-center h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rounded-xl">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // Don't render if not authenticated or not a recruiter
  if (status !== "authenticated" || session?.user?.role !== "recruiter") {
    return null;
  }

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    AUD: "A$",
    INR: "₹",
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rounded-xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Post a New Job
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Fill in the details below to create a new job posting
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Briefcase className="h-5 w-5 text-blue-500" />
              Basic Information
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Provide the basic details about the job
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="title"
                    placeholder="e.g. Senior Frontend Developer"
                    className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    {...register("title")}
                  />
                </div>
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="company"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="company"
                    placeholder="e.g. Tech Corp"
                    className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    {...register("company")}
                  />
                </div>
                {errors.company && (
                  <p className="text-sm text-red-500">
                    {errors.company.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Location <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="e.g. San Francisco, CA"
                    className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    {...register("location")}
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-red-500">
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("category", value as any)}
                  defaultValue=""
                >
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
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
                {errors.category && (
                  <p className="text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="industry"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Industry <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="industry"
                  placeholder="e.g. Technology, Healthcare, Finance"
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  {...register("industry")}
                />
                {errors.industry && (
                  <p className="text-sm text-red-500">
                    {errors.industry.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="companyWebsite"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Company Website
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="companyWebsite"
                    placeholder="https://example.com"
                    className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    {...register("companyWebsite")}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRemote"
                checked={watchedIsRemote}
                onCheckedChange={(checked) =>
                  setValue("isRemote", checked as boolean)
                }
              />
              <Label
                htmlFor="isRemote"
                className="text-gray-700 dark:text-gray-300"
              >
                This is a remote position
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <FileText className="h-5 w-5 text-blue-500" />
              Job Details
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Provide detailed information about the job
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
              >
                Job Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the role, company culture, and what makes this position exciting..."
                rows={4}
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                Responsibilities <span className="text-red-500">*</span>
              </Label>
              {responsibilityFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    {...register(`responsibilities.${index}`)}
                    placeholder={`Responsibility ${index + 1}`}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  />
                  {responsibilityFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResponsibility(index)}
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
                onClick={() => appendResponsibility("")}
                className="mt-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Responsibility
              </Button>
              {errors.responsibilities && (
                <p className="text-sm text-red-500">
                  {errors.responsibilities.message}
                </p>
              )}
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                Requirements <span className="text-red-500">*</span>
              </Label>
              {requirementFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    {...register(`requirements.${index}`)}
                    placeholder={`Requirement ${index + 1}`}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  />
                  {requirementFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRequirement(index)}
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
                onClick={() => appendRequirement("")}
                className="mt-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Requirement
              </Button>
              {errors.requirements && (
                <p className="text-sm text-red-500">
                  {errors.requirements.message}
                </p>
              )}
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Benefits
              </Label>
              {benefitFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    {...register(`benefits.${index}`)}
                    placeholder={`Benefit ${index + 1}`}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBenefit(index)}
                    className="p-1 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendBenefit("")}
                className="mt-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Benefit
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="type"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Job Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watchedType}
                  onValueChange={(value) => setValue("type", value as any)}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
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
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="experience"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Experience Level <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("experience", value as any)
                  }
                  defaultValue=""
                >
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experience && (
                  <p className="text-sm text-red-500">
                    {errors.experience.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="applicationDeadline"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Application Deadline <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="applicationDeadline"
                    type="date"
                    className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    {...register("applicationDeadline")}
                  />
                </div>
                {errors.applicationDeadline && (
                  <p className="text-sm text-red-500">
                    {errors.applicationDeadline.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Status
                </Label>
                <Select
                  value={watchedStatus}
                  onValueChange={(value) => setValue("status", value as any)}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compensation */}
        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <DollarSign className="h-5 w-5 text-blue-500" />
              Compensation
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Provide salary and compensation details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="salary.min"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Minimum Salary <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    {currencySymbols[watchedSalaryCurrency] || "$"}
                  </span>
                  <Input
                    id="salary.min"
                    type="number"
                    placeholder="e.g. 80000"
                    className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    {...register("salary.min", { valueAsNumber: true })}
                  />
                </div>
                {errors.salary?.min && (
                  <p className="text-sm text-red-500">
                    {errors.salary.min.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="salary.max"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Maximum Salary <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    {currencySymbols[watchedSalaryCurrency] || "$"}
                  </span>
                  <Input
                    id="salary.max"
                    type="number"
                    placeholder="e.g. 120000"
                    className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    {...register("salary.max", { valueAsNumber: true })}
                  />
                </div>
                {errors.salary?.max && (
                  <p className="text-sm text-red-500">
                    {errors.salary.max.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="salary.currency"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Currency
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("salary.currency", value as any)
                  }
                  defaultValue="USD"
                >
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="salary.period"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Period
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("salary.period", value as any)
                  }
                  defaultValue="yearly"
                >
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Process */}
        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Users className="h-5 w-5 text-blue-500" />
              Application Process
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Configure how candidates will apply for this position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="applicationMethod"
                className="text-gray-700 dark:text-gray-300"
              >
                Application Method
              </Label>
              <Select
                value={watchedApplicationMethod}
                onValueChange={(value) =>
                  setValue("applicationMethod", value as any)
                }
              >
                <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                  <SelectValue placeholder="Select application method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform">
                    Apply through platform
                  </SelectItem>
                  <SelectItem value="email">Apply via email</SelectItem>
                  <SelectItem value="external">
                    Apply on external website
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {watchedApplicationMethod === "email" && (
              <div className="space-y-2">
                <Label
                  htmlFor="applicationEmail"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Application Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="applicationEmail"
                  type="email"
                  placeholder="e.g. jobs@company.com"
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  {...register("applicationEmail")}
                />
                {errors.applicationEmail && (
                  <p className="text-sm text-red-500">
                    {errors.applicationEmail.message}
                  </p>
                )}
              </div>
            )}
            {watchedApplicationMethod === "external" && (
              <div className="space-y-2">
                <Label
                  htmlFor="applicationUrl"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Application URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="applicationUrl"
                  placeholder="https://careers.company.com/apply"
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  {...register("applicationUrl")}
                />
                {errors.applicationUrl && (
                  <p className="text-sm text-red-500">
                    {errors.applicationUrl.message}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Tag className="h-5 w-5 text-blue-500" />
              Additional Information
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Add tags and promotional options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Tags</Label>
              {tagFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    {...register(`tags.${index}`)}
                    placeholder={`Tag ${index + 1}`}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(index)}
                    className="p-1 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendTag("")}
                className="mt-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Tag
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  onCheckedChange={(checked) =>
                    setValue("featured", checked as boolean)
                  }
                />
                <Label
                  htmlFor="featured"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Feature this job posting
                </Label>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="promotedUntil"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Promotion End Date
                </Label>
                <Input
                  id="promotedUntil"
                  type="date"
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  {...register("promotedUntil")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="shadow-sm"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="shadow-sm">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Briefcase className="mr-2 h-4 w-4" />
                Post Job
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
