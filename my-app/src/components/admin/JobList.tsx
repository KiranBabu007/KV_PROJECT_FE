import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin,
  Users,
  Calendar,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  Building2,
  Target,
} from "lucide-react";
import { format } from "date-fns";
import type { Job } from "@/types";
import JobForm from "./JobForm";
import { useAddJobMutation, useGetJobsListQuery } from "@/api-service/job/job.api.ts";

// Local mock data
// const initialJobs: Job[] = [
//   {
//     id: "1",
//     title: "Senior Software Engineer",
//     description:
//       "We are looking for an experienced software engineer to join our team.",
//     requirements: ["React", "TypeScript", "5+ years experience"],
//     location: "San Francisco, CA",
//     salary: "₹90,00,000 - ₹1,35,00,000",
//     experience: "5+ years",
//     openPositions: 2,
//     totalPositions: 3,
//     createdAt: new Date("2024-01-15"),
//     updatedAt: new Date("2024-01-15"),
//     status: "active",
//     numOfPositions: 3,
//     bonusForReferral: 5000,
//     skills: "AI/ML",
//   },
//   {
//     id: "2",
//     title: "Product Manager",
//     description: "Lead product strategy and development for our core platform.",
//     requirements: ["Product Management", "Agile", "3+ years experience"],
//     location: "New York, NY",
//     salary: "₹75,00,000 - ₹1,05,00,000",
//     experience: "3-5 years",
//     openPositions: 1,
//     totalPositions: 1,
//     createdAt: new Date("2024-01-20"),
//     updatedAt: new Date("2024-01-20"),
//     status: "active",
//     numOfPositions: 3,
//     bonusForReferral: 5000,
//     skills: "AI/ML",
//   },
// ];

const JobList: React.FC = () => {
  // Replace the static initialJobs with API call
  const { data: jobsData, isLoading, error } = useGetJobsListQuery({});
  const [jobs, setJobs] = useState<Job[]>([]);
 
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (jobsData) {
      const formattedJobs = jobsData.map((job) => ({
        id: job.id.toString(),
        title: job.title,
        description: job.description,
        requirements: job.skills.split(", "), // Convert skills string to array
        location: job.location,
        salary: `₹${(job.salary / 100000).toFixed(2)} LPA`,
        experience: `${job.experience}+ years`,
        openPositions: job.numOfPositions,
        totalPositions: job.numOfPositions,
        createdAt: new Date(job.createdAt),
        updatedAt: new Date(job.updatedAt),
        status: job.deletedAt ? "closed" : "active",
        bonusForReferral: job.bonusForReferral,
      }));
      setJobs(formattedJobs);
    }
  }, [jobsData]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addJob = (jobData: Omit<Job, "id" | "createdAt" | "updatedAt">) => {
    const newJob: Job = {
      ...jobData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setJobs((prev) => [...prev, newJob]);
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, ...updates, updatedAt: new Date() } : job
      )
    );
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
      : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200";
  };

  const handleToggleStatus = (job: Job) => {
    updateJob(job.id, {
      status: job.status === "active" ? "closed" : "active",
    });
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingJob(null);
  };

  // Add loading state
  if (isLoading) {
    return <div>Loading jobs...</div>;
  }

  // Add error state
  if (error) {
    return <div>Error loading jobs: {error.toString()}</div>;
  }

  return (
    <div className="space-y-6">
      {jobs.length === 0 ? (
        <Card className="glass border-0 shadow-xl animate-fade-in">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-gray-500 text-lg">
                No jobs posted yet. Create your first job posting!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        jobs.map((job, index) => (
          <Card
            key={job.id}
            className="card-hover glass border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-4 bg-gradient-to-r from-white/50 to-blue-50/30 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-800 transition-colors duration-300">
                      {job.title}
                    </CardTitle>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm text-gray-600">
                    <span className="flex items-center space-x-1 bg-white/70 px-2 py-1 rounded-lg">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span>{job.location}</span>
                    </span>

                    <span className="flex items-center space-x-1 bg-white/70 px-2 py-1 rounded-lg">
                      <DollarSign className="h-4 w-4 text-purple-500" />
                      <span>{job.salary}</span>
                    </span>
                    <span className="flex items-center space-x-1 bg-white/70 px-2 py-1 rounded-lg">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>{job.experience}</span>
                    </span>
                    <span className="flex items-center space-x-1 bg-white/70 px-2 py-1 rounded-lg">
                      <Calendar className="h-4 w-4 text-red-500" />
                      <span>{format(job.createdAt, "MMM d, yyyy")}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    className={`${getStatusColor(
                      job.status
                    )} border shadow-sm font-medium px-3 py-1`}
                  >
                    {job.status}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200 shadow-sm font-medium px-3 py-1">
                    <Users className="h-3 w-3 mr-1" />
                    {job.openPositions}/{job.totalPositions}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-4 rounded-xl">
                <p className="text-gray-700 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-500" />
                  Requirements:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req, reqIndex) => (
                    <Badge
                      key={req}
                      variant="secondary"
                      className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 hover:scale-105 transition-transform duration-200"
                      style={{ animationDelay: `${reqIndex * 50}ms` }}
                    >
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-lg">
                  <span className="font-medium text-green-800">
                    {job.openPositions} positions available
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(job)}
                    className="hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {job.status === "active" ? "Close Job" : "Reopen Job"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditJob(job)}
                    className="hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteJob(job.id)}
                    className="hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
          </DialogHeader>
          {editingJob && (
            <JobForm
              job={editingJob}
              mode="edit"
              onCancel={handleCloseEditDialog}
              // onSubmit={handleJobFormSubmit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobList;
