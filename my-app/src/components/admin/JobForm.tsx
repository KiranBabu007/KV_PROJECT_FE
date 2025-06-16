import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { Job } from '@/types';

interface JobFormProps {
  onCancel?: () => void;
  job?: Job; // Optional job for editing
  mode?: 'create' | 'edit';
  onSubmit?: (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> | { id: string; updates: Partial<Job> }) => void;
}

const JobForm: React.FC<JobFormProps> = ({ onCancel, job, mode = 'create', onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    experience: '',
    totalPositions: 1,
  });
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');

  // Load job data when editing
  useEffect(() => {
    if (job && mode === 'edit') {
      setFormData({
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary,
        experience: job.experience,
        totalPositions: job.totalPositions,
      });
      setRequirements(job.requirements);
    }
  }, [job, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'edit' && job) {
      onSubmit?.({
        id: job.id,
        updates: {
          ...formData,
          requirements,
          openPositions: formData.totalPositions,
        }
      });
    } else {
      onSubmit?.({
        ...formData,
        requirements,
        openPositions: formData.totalPositions,
        status: 'active' as const
      });
    }
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      location: '',
      salary: '',
      experience: '',
      totalPositions: 1,
    });
    setRequirements([]);
    onCancel?.();
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (requirement: string) => {
    setRequirements(requirements.filter(r => r !== requirement));
  };

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
            placeholder="e.g., $80,000 - $120,000"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Experience Required</Label>
          <Input
            id="experience"
            placeholder="e.g., 3-5 years"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="positions">Number of Positions</Label>
          <Input
            id="positions"
            type="number"
            min="1"
            value={formData.totalPositions}
            onChange={(e) => setFormData({ ...formData, totalPositions: parseInt(e.target.value) || 1 })}
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
        <Button type="submit">
          {mode === 'edit' ? 'Update Job' : 'Create Job'}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;