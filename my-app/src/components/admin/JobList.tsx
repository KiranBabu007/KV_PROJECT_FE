import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
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
import type { Job } from '@/types';
import JobForm from "./JobForm";
import { useAddJobMutation, useDeleteJobMutation, useGetJobsListQuery, usePatchJobMutation } from "@/api-service/job/job.api.ts";

const JobList: React.FC = () => {
  const { data: jobsData, isLoading, error, refetch } = useGetJobsListQuery({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jobToDeleteId, setJobToDeleteId] = useState<string | null>(null);

  // RTK Query mutations
  const [addJobMutation] = useAddJobMutation();
  const [patchJobMutation] = usePatchJobMutation();
  const [deleteJobMutation] = useDeleteJobMutation();

  useEffect(() => {
    if (jobsData) {
      const formattedJobs = jobsData.map((job: any) => ({
        id: job.id.toString(),
        title: job.title,
        description: job.description,
        requirements: job.skills ? job.skills.split(", ") : [],
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

  // Function to initiate delete (opens confirmation dialog)
  const handleDeleteClick = (id: string) => {
    setJobToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  // Function to execute deletion after confirmation
  const confirmDeleteJob = async () => {
    if (jobToDeleteId) {
      try {
        await deleteJobMutation({ id: jobToDeleteId }).unwrap();
        refetch(); // Refetch to update the list from the server
        console.log(`Job with ID ${jobToDeleteId} deleted successfully.`);
      } catch (deleteError) {
        console.error("Error deleting job:", deleteError);
        // You might want to show a toast or error message here
      } finally {
        setIsDeleteDialogOpen(false); // Close dialog regardless of success/failure
        setJobToDeleteId(null); // Clear the ID
      }
    }
  };

  const handleJobFormSubmit = async (data: any) => {
    console.log("Form Data received in handle handleJobFormSubmit:", data);

    try {
      if (data.id) {
        const { id, ...patch } = data;
        console.log("Patching job with ID:", id);
        console.log("Patch data:", patch);

        const result = await patchJobMutation({ id, ...patch }).unwrap();
        console.log("Patch result:", result);

        refetch();
        handleCloseEditDialog();
      } else {
        console.log("Creating new job");
        const result = await addJobMutation(data).unwrap();
        console.log("Create result:", result);

        refetch();
      }
    } catch (error) {
      console.error("Error submitting job form:", error);
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
      : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200";
  };

  const handleToggleStatus = async (job: Job) => {
    try {
      console.log("Toggling status for job:", job.id);
      const newStatus = job.status === "active" ? "closed" : "active";

      const result = await patchJobMutation({
        id: job.id,
        status: newStatus,
      }).unwrap();

      console.log("Status toggle result:", result);
      refetch();
    } catch (error) {
      console.error("Error toggling job status:", error);
    }
  };

  const handleEditJob = (job: Job) => {
    console.log("Editing job:", job);
    setEditingJob(job);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingJob(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  if (error) {
    console.error("Error loading jobs:", error);
    return <div className="text-center py-8 text-red-600">Error loading jobs: {error.toString()}</div>;
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
                      key={`${req}-${reqIndex}`}
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
                  {/* Changed onClick to open dialog */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(job.id)}
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
              onSubmit={handleJobFormSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job
              posting and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteJob}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobList;