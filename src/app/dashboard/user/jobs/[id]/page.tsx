// app/dashboard/user/jobs/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchJobById,
  applyToJob,
  saveJob,
  unsaveJob,
} from "@/redux/slices/job-slice";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Bookmark,
  Send,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();
  const { currentJob, isLoading } = useSelector(
    (state: RootState) => state.jobs
  );
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (jobId && mounted) {
      dispatch(fetchJobById(jobId));
    }
  }, [dispatch, jobId, mounted]);

  useEffect(() => {
    if (currentJob && session?.user?.id && mounted) {
      // Check if job is saved
      // In a real app, you would fetch this from the API
      setIsSaved(false); // Default to false for now
    }
  }, [currentJob, session, mounted]);

  const handleApply = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to apply for a job");
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
      if (isSaved) {
        await dispatch(
          unsaveJob({
            userId: session.user.id,
            jobId,
          })
        ).unwrap();
        toast.success("Job removed from saved jobs");
      } else {
        await dispatch(
          saveJob({
            userId: session.user.id,
            jobId,
          })
        ).unwrap();
        toast.success("Job saved successfully");
      }
      setIsSaved(!isSaved);
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

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isLoading) {
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
        <h1 className="text-3xl font-bold">{currentJob.title}</h1>
        <p className="text-xl text-gray-600">{currentJob.company}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">About {currentJob.company}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Company description would go here. In a real application,
                    this would be fetched from the database.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentJob.location}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Website</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      www.example.com
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="capitalize">{currentJob.type}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span>{currentJob.salary}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span>
                  Posted {new Date(currentJob.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                onClick={handleApply}
                disabled={isApplying}
              >
                <Send className="mr-2 h-4 w-4" />
                {showApplicationForm ? "Submit Application" : "Apply Now"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSaveJob}
                disabled={isSaving}
              >
                <Bookmark className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : isSaved ? "Saved" : "Save Job"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
