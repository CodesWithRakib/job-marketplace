// app/dashboard/user/jobs/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchJobById } from "@/redux/slices/jobSlice";
import {
  saveJob,
  unsaveJob,
  applyToJob,
  fetchSavedJobs,
} from "@/redux/slices/applicationSlice";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Bookmark,
  Send,
  ArrowLeft,
  Loader2,
  Globe,
  Calendar,
  Eye,
  Star,
  Mail,
  ExternalLink,
  Users,
  Building,
  Award,
  CheckCircle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import Image from "next/image";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const { theme } = useTheme();

  // Updated to match the store structure
  const { entities: jobEntities, ui: jobUI } = useSelector(
    (state: RootState) => state.jobs
  );
  const { savedJobs, ui: applicationUI } = useSelector(
    (state: RootState) => state.applications
  );

  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Get current job from entities
  const currentJob = jobEntities[jobId];

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (jobId && mounted) {
      dispatch(fetchJobById(jobId));

      // Fetch saved jobs when user is logged in
      if (session?.user?.id) {
        dispatch(fetchSavedJobs(session.user.id));
      }
    }
  }, [dispatch, jobId, mounted, session]);

  // Check if job is saved
  const isJobSaved = Object.values(savedJobs).some(
    (savedJob) => savedJob.jobId === jobId
  );

  const handleApply = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to apply for a job");
      return;
    }

    // If application method is not platform, redirect accordingly
    if (
      currentJob?.applicationMethod === "email" &&
      currentJob?.applicationEmail
    ) {
      window.open(
        `mailto:${currentJob.applicationEmail}?subject=Application for ${currentJob.title}`,
        "_blank"
      );
      return;
    }

    // Updated to match schema: changed from "url" to "external"
    if (
      currentJob?.applicationMethod === "external" &&
      currentJob?.applicationUrl
    ) {
      window.open(currentJob.applicationUrl, "_blank");
      return;
    }

    if (!showApplicationForm) {
      setShowApplicationForm(true);
      return;
    }

    setIsApplying(true);
    try {
      await dispatch(
        applyToJob({
          userId: session.user.id,
          jobId,
          coverLetter,
        })
      ).unwrap();
      toast.success("Application submitted successfully!");
      setShowApplicationForm(false);
      setCoverLetter("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to save a job");
      return;
    }

    setIsSaving(true);
    try {
      if (isJobSaved) {
        // Find the saved job ID to unsave it
        const savedJobEntry = Object.entries(savedJobs).find(
          ([_, savedJob]) => savedJob.jobId === jobId
        );

        if (savedJobEntry) {
          const savedJobId = savedJobEntry[0];
          await dispatch(unsaveJob(savedJobId)).unwrap();
          toast.success("Job removed from saved jobs");
        }
      } else {
        await dispatch(
          saveJob({
            userId: session.user.id,
            jobId,
          })
        ).unwrap();
        toast.success("Job saved successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save job");
    } finally {
      setIsSaving(false);
    }
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

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (jobUI.isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Job not found</h1>
          <p className="text-gray-600 mt-2">
            The job you&apos;re looking for doesn&apos;t exist
          </p>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isPromoted =
    currentJob.promotedUntil && new Date(currentJob.promotedUntil) > new Date();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{currentJob.title}</h1>
              {currentJob.featured && (
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {isPromoted && (
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                  <Award className="h-3 w-3 mr-1" />
                  Promoted
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-lg">
              <span className="text-xl text-gray-600">
                {currentJob.company}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant={getTypeBadgeVariant(currentJob.type)}>
                  {currentJob.type}
                </Badge>
                {currentJob.isRemote && <Badge variant="outline">Remote</Badge>}
                {getStatusBadge(currentJob.status)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Eye className="h-4 w-4" />
            <span>{currentJob.views} views</span>
            <Calendar className="h-4 w-4 ml-2" />
            <span>
              Posted {format(new Date(currentJob.createdAt), "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="responsibilities">
                Responsibilities
              </TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none dark:prose-invert">
                    <p>{currentJob.description}</p>
                  </div>
                </CardContent>
              </Card>
              {currentJob.benefits && currentJob.benefits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentJob.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="responsibilities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentJob.responsibilities &&
                    currentJob.responsibilities.length > 0 ? (
                      currentJob.responsibilities.map(
                        (responsibility, index) => (
                          <li key={index} className="flex items-start">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span>{responsibility}</span>
                          </li>
                        )
                      )
                    ) : (
                      <p className="text-gray-500">
                        No specific responsibilities listed
                      </p>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="requirements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Requirements & Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentJob.requirements &&
                    currentJob.requirements.length > 0 ? (
                      currentJob.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No specific requirements listed
                      </p>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="company" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg w-16 h-16 flex items-center justify-center">
                        {currentJob.companyLogo ? (
                          <Image
                            src={currentJob.companyLogo}
                            alt={`${currentJob.company} logo`}
                            className="w-full h-full object-contain rounded-lg"
                            width={64}
                            height={64}
                          />
                        ) : (
                          <Building className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {currentJob.company}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {currentJob.industry}
                        </p>
                        {currentJob.companyWebsite && (
                          <a
                            href={
                              currentJob.companyWebsite.startsWith("http")
                                ? currentJob.companyWebsite
                                : `https://${currentJob.companyWebsite}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-1"
                          >
                            <Globe className="h-4 w-4 mr-1" />
                            Visit website
                          </a>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">
                        About {currentJob.company}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Company description would go here. In a real
                        application, this would be fetched from the database.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {currentJob.location}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Category</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {currentJob.category}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {showApplicationForm && (
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Job</CardTitle>
                <CardDescription>
                  Submit your application for this position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                  <Textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={4}
                    placeholder="Write a brief cover letter explaining why you're a good fit for this position..."
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowApplicationForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleApply} disabled={isApplying}>
                    {isApplying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span>{currentJob.location}</span>
                {currentJob.isRemote && (
                  <Badge variant="outline" className="ml-2">
                    Remote
                  </Badge>
                )}
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="capitalize">{currentJob.type}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="capitalize">
                  {currentJob.experience} Level
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span>{currentJob.formattedSalary}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span>
                  Posted {format(new Date(currentJob.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              {currentJob.applicationDeadline && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span>
                    Apply by{" "}
                    {format(
                      new Date(currentJob.applicationDeadline),
                      "MMM d, yyyy"
                    )}
                    {currentJob.daysUntilDeadline !== undefined && (
                      <span className="ml-2 text-sm">
                        ({currentJob.daysUntilDeadline} days left)
                      </span>
                    )}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span>{currentJob.applicationCount} applicants</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Application Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentJob.applicationMethod === "platform" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Apply directly through our platform
                  </p>
                  <Button
                    className="w-full"
                    onClick={handleApply}
                    disabled={isApplying}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {showApplicationForm ? "Submit Application" : "Apply Now"}
                  </Button>
                </div>
              )}
              {currentJob.applicationMethod === "email" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Apply via email
                  </p>
                  <Button
                    className="w-full"
                    onClick={handleApply}
                    disabled={isApplying}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Apply via Email
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This will open your email client
                  </p>
                </div>
              )}
              {/* Updated to match schema: changed from "url" to "external" */}
              {currentJob.applicationMethod === "external" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Apply on the company website
                  </p>
                  <Button
                    className="w-full"
                    onClick={handleApply}
                    disabled={isApplying}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Apply on Company Website
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This will open an external website
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSaveJob}
                disabled={isSaving}
              >
                <Bookmark
                  className={`mr-2 h-4 w-4 ${isJobSaved ? "fill-current" : ""}`}
                />
                {isSaving ? "Saving..." : isJobSaved ? "Saved" : "Save Job"}
              </Button>
            </CardContent>
          </Card>
          {currentJob.tags && currentJob.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentJob.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {isPromoted && (
            <Card className="border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <h3 className="font-medium text-purple-800 dark:text-purple-300">
                      Promoted Job
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      This job is being promoted until{" "}
                      {format(
                        new Date(currentJob.promotedUntil),
                        "MMM d, yyyy"
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
