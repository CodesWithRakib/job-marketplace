// app/dashboard/recruiter/post-job/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createJob } from "@/redux/slices/job-slice";
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
import { toast } from "sonner";
import {
  Loader2,
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Star,
  X,
  Plus,
  Tag,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["full-time", "part-time", "contract", "internship"]),
  salary: z.string().min(1, "Salary is required"),
  status: z.enum(["active", "inactive"]).default("active"),
  applicationDeadline: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
});
type JobFormData = z.infer<typeof jobSchema>;

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
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
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      type: "full-time",
      status: "active",
    },
  });

  const watchedType = watch("type");
  const watchedStatus = watch("status");

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
      setValue("skills", [...skills, skillInput.trim()].join(", "));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    setValue("skills", updatedSkills.join(", "));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const onSubmit = async (data: JobFormData) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to post a job");
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(
        createJob({
          ...data,
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

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rounded-xl">
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

      <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Briefcase className="h-5 w-5 text-blue-500" />
            Job Details
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Provide information about the job position
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder="e.g. San Francisco, CA or Remote"
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
                  htmlFor="salary"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  Salary Range <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="salary"
                    placeholder="e.g. $80,000 - $120,000"
                    className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    {...register("salary")}
                  />
                </div>
                {errors.salary && (
                  <p className="text-sm text-red-500">
                    {errors.salary.message}
                  </p>
                )}
              </div>

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
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="applicationDeadline"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Application Deadline
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
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="experience"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Experience Level
                </Label>
                <Select
                  value={watch("experience")}
                  onValueChange={(value) => setValue("experience", value)}
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
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                Required Skills
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a skill"
                    className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSkill}
                  disabled={!skillInput.trim()}
                  className="shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <input type="hidden" {...register("skills")} />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-gray-700 dark:text-gray-300 flex items-center gap-1"
              >
                Job Description <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="description"
                  placeholder="Describe the job responsibilities, requirements, and benefits..."
                  rows={6}
                  className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  {...register("description")}
                />
              </div>
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

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
              <Button
                type="submit"
                disabled={isSubmitting}
                className="shadow-sm"
              >
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
        </CardContent>
      </Card>
    </div>
  );
}
