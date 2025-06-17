import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { Job } from '@/types';
import { useAddJobMutation } from '@/api-service/job/job.api';

interface JobFormProps {
  onCancel?: () => void;
  job?: Job; // Optional job for editing
  mode?: 'create' | 'edit';
  // onSubmit?: (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> | { id: string; updates: Partial<Job> }) => void;
}

const JobForm: React.FC<JobFormProps> = ({ onCancel, job, mode = 'create' }) => {
  const [addJob] = useAddJobMutation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: 0,
    experience: 0,
    numOfPositions: 1,
    skills: '',
    bonusForReferral: 0
  });
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
   const [create, { isLoading }] = useAddJobMutation();
  // Load job data when editing
  useEffect(() => {
    if (job && mode === 'edit') {
      setFormData({
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary,
        experience: job.experience,
        numOfPositions: job.totalPositions,
        bonusForReferral: job.bonusForRefferal,
      });
      setRequirements(job.requirements);
    }
  }, [job, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert requirements array to comma-separated string for skills
      const jobData = {
        ...formData,
        skills: requirements.join(', ')
      };

      if (mode === 'create') {
        await addJob(jobData).unwrap();
        // Reset form after successful creation
        setFormData({
          title: '',
          description: '',
          location: '',
          salary: 0,
          experience: 0,
          numOfPositions: 1,
          skills: '',
          bonusForReferral: 0
        });
        setRequirements([]);
        onCancel?.();
      }
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  }
  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (requirement: string) => {
    setRequirements(requirements.filter(r => r !== requirement));
  };

  // Update the form inputs to handle number types correctly
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

      

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            type="number"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Experience (Years)</Label>
          <Input
            id="experience"
            type="number"
            min="0"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numOfPositions">Number of Positions</Label>
          <Input
            id="numOfPositions"
            type="number"
            min="1"
            value={formData.numOfPositions}
            onChange={(e) => setFormData({ ...formData, numOfPositions: Number(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bonusForReferral">Referral Bonus</Label>
          <Input
            id="bonusForReferral"
            type="number"
            min="0"
            value={formData.bonusForReferral}
            onChange={(e) => setFormData({ ...formData, bonusForReferral: Number(e.target.value) })}
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
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
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
        <Button type="submit" onClick={handleSubmit}>
          {mode === 'edit' ? 'Update Job' : 'Create Job'}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;