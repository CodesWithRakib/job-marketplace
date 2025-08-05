// app/dashboard/user/jobs/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchJobById } from "@/redux/slices/job-slice";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  Bookmark,
  BookmarkOff,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const { currentJob, isLoading } = useSelector(
    (state: RootState) => state.jobs
  );
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchJobById(params.id as string));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (currentJob && session?.user?.id) {
      // Check if job is saved
      setIsSaved(false); // This would be determined by checking savedJobs in Redux
      // Check if user has applied
      setHasApplied(false); // This would be determined by checking userApplications in Redux
    }
  }, [currentJob, session]);

  const handleSaveJob = async () => {
    if (session?.user?.id && currentJob) {
      try {
        if (isSaved) {
          // Unsave job logic
          toast.success("Job removed from saved jobs");
        } else {
          // Save job logic
          toast.success("Job saved successfully");
        }
        setIsSaved(!isSaved);
      } catch (error) {
        toast.error("Failed to save job");
      }
    }
  };

  const handleApplyToJob = async () => {
    if (session?.user?.id && currentJob) {
      try {
        // Apply to job logic
        toast.success("Application submitted successfully");
        setHasApplied(true);
      } catch (error) {
        toast.error("Failed to apply to job");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Job not found</h1>
          <p className="text-gray-600 mt-2">
            The job you're looking for doesn't exist.
          </p>
          <Link href="/dashboard/user">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/user">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{currentJob.title}</h1>
        <div className="flex items-center gap-4 mt-2">
          <Badge variant="outline">{currentJob.type}</Badge>
          <Badge
            variant={currentJob.status === "active" ? "default" : "secondary"}
          >
            {currentJob.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>{currentJob.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {currentJob.company?.charAt(0).toUpperCase() || "C"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {currentJob.company}
                  </h3>
                  <p className="text-gray-600">
                    Posted {new Date(currentJob.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <span>{currentJob.location}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                <span>{currentJob.salary}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-gray-500 mr-2" />
                <span>{currentJob.type}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
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
            <CardContent className="space-y-4">
              <Button
                className="w-full"
                onClick={handleApplyToJob}
                disabled={hasApplied}
              >
                {hasApplied ? "Already Applied" : "Apply Now"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSaveJob}
              >
                {isSaved ? (
                  <>
                    <BookmarkOff className="mr-2 h-4 w-4" />
                    Remove from Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save Job
                  </>
                )}
              </Button>
              <Link href={`/dashboard/user/messages/${currentJob.recruiterId}`}>
                <Button variant="outline" className="w-full">
                  Message Recruiter
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
