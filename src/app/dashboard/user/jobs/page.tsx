"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { fetchJobs, saveJob, unsaveJob } from "@/redux/slices/job-slice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

export default function JobsPage() {
  const dispatch = useDispatch();
  const { jobs, savedJobs, isLoading } = useSelector(
    (state: RootState) => state.jobs
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    dispatch(fetchJobs());
    if (user) {
      dispatch(fetchSavedJobs(user.id));
    }
  }, [dispatch, user]);

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      locationFilter === "" ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesType = typeFilter === "" || job.job_type === typeFilter;

    return matchesSearch && matchesLocation && matchesType;
  });

  const isJobSaved = (jobId: string) => {
    return savedJobs.some((job) => job.id === jobId);
  };

  const handleSaveJob = async (jobId: string) => {
    if (!user) return;

    try {
      if (isJobSaved(jobId)) {
        await dispatch(unsaveJob({ userId: user.id, jobId })).unwrap();
        toast({
          title: "Job unsaved",
          description: "Job removed from your saved list",
        });
      } else {
        await dispatch(saveJob({ userId: user.id, jobId })).unwrap();
        toast({
          title: "Job saved",
          description: "Job added to your saved list",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      });
    }
  };

  const getJobTypeBadgeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-blue-500";
      case "part-time":
        return "bg-green-500";
      case "contract":
        return "bg-purple-500";
      case "internship":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Jobs</CardTitle>
          <CardDescription>Browse available job opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No jobs found matching your criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold mr-3">
                            {job.title}
                          </h3>
                          <Badge className={getJobTypeBadgeColor(job.job_type)}>
                            {job.job_type.replace("-", " ")}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {job.description.substring(0, 150)}...
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Posted {format(new Date(job.created_at), "MMM dd")}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills?.slice(0, 5).map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveJob(job.id)}
                          className="p-2"
                        >
                          {isJobSaved(job.id) ? (
                            <BookmarkCheck className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Bookmark className="h-5 w-5" />
                          )}
                        </Button>

                        <Button asChild>
                          <Link href={`/dashboard/user/jobs/${job.id}`}>
                            View Details
                          </Link>
                        </Button>

                        <Button variant="outline" asChild>
                          <Link href={`/dashboard/user/jobs/${job.id}/apply`}>
                            Apply Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
