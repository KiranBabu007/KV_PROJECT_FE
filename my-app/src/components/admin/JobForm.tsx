import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { Job } from "@/types";

// The 'onSubmit' prop is crucial for communication
interface JobFormProps {
  onCancel?: () => void;
  job?: Job;
  mode?: "create" | "edit";
  onSubmit: (data: any) => void; // Keeping as 'any' for now, but better to type this
}

const JobForm: React.FC<JobFormProps> = ({
  onCancel,
  job,
  mode = "create",
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: 0,
    experience: 0,
    numOfPositions: 1,
    bonusForReferral: 0,
  });
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");

  // Correctly parse incoming job data for editing
  useEffect(() => {
    if (job && mode === "edit") {
      // Safely parse numbers from formatted strings
      // Assuming salary from job object is a string like "₹90,00,000 - ₹1,35,00,000" or "₹90,00,000"
      // We need to convert it back to a number in lakhs for the input field.
      // The JobList currently formats salary as `₹${(job.salary / 100000).toFixed(2)} LPA`.
      // Let's assume the backend 'salary' field is directly in the numerical value (e.g., 9000000).
      // If job.salary is a string like "₹90,00,000 - ₹1,35,00,000", you'll need more robust parsing.
      // For now, assuming job.salary from the API (via useGetJobsListQuery) is a number.
      const salaryNumber =
        typeof job.salary === "string"
          ? parseInt(job.salary.replace(/[^0-9]/g, ""), 10) || 0
          : job.salary;

      const experienceNumber =
        typeof job.experience === "string"
          ? parseInt(job.experience.replace(/[^0-9]/g, ""), 10) || 0
          : job.experience;

      setFormData({
        title: job.title,
        description: job.description,
        location: job.location,
        salary: salaryNumber,
        experience: experienceNumber,
        numOfPositions: job.numOfPositions, // Assuming totalPositions is the correct field for the number of positions
        bonusForReferral: job.bonusForRefferal,
      });
      setRequirements(job.skills.split(",") || []);
    }
  }, [job, mode]);

  // Handle form submission for BOTH 'create' and 'edit' modes
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data to be sent
    const jobDataToSubmit = {
      ...formData,
      skills: requirements.join(", "), // Convert requirements array to a comma-separated string
    };

    // If in edit mode, add the job ID to the data
    if (mode === "edit" && job) {
      onSubmit({ id: job.id, ...jobDataToSubmit });
      if (onCancel) onCancel();
    } else {
      onSubmit(jobDataToSubmit);
      if (onCancel) onCancel();
    }
  };

  const addRequirement = () => {
    if (
      newRequirement.trim() &&
      !requirements.includes(newRequirement.trim())
    ) {
      setRequirements([...(requirements || []), newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (requirement: string) => {
    setRequirements(requirements.filter((r) => r !== requirement));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary">Salary (LPA)</Label>
          {/* Input expects salary in LPA, convert to full amount for internal state */}
          <Input
            id="salary"
            type="number"
            value={
              formData.salary || formData.salary === 0
                ? formData.salary.toString()
                : ""
            }// Display as LPA
            onChange={(e) =>
              setFormData({
                ...formData,
                salary: Number(e.target.value) * 100000,
              })
            } // Store as full amount
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Experience (Years)</Label>
          <Input
            id="experience"
            type="number"
            min="0"
            value={
              formData.experience || formData.experience === 0
                ? formData.experience.toString()
                : ""
            }
            onChange={(e) =>
              setFormData({ ...formData, experience: Number(e.target.value) })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numOfPositions">Number of Positions</Label>
          <Input
            id="numOfPositions"
            type="number"
            min="1"
            value={
              formData.numOfPositions|| formData.numOfPositions=== 0
                ? formData.numOfPositions.toString()
                : ""
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                numOfPositions: Number(e.target.value),
              })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bonusForReferral">Referral Bonus</Label>
          <Input
            id="bonusForReferral"
            type="number"
            min="0"
            value={
              formData.bonusForReferral || formData.bonusForReferral === 0
                ? formData.bonusForReferral.toString()
                : ""
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                bonusForReferral: Number(e.target.value),
              })
            }
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Requirements</Label>
        <div className="flex space-x-2">
          <Input
            placeholder="Add a requirement"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addRequirement())
            }
          />
          <Button type="button" onClick={addRequirement}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {requirements.map((requirement) => (
            <Badge key={requirement} variant="secondary" className="pr-1">
              {requirement}
              <button
                type="button"
                onClick={() => removeRequirement(requirement)}
                className="ml-1 hover:bg-gray-200 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {mode === "edit" ? "Update Job" : "Create Job"}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
