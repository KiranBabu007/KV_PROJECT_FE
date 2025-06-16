import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, Calendar, Search, UserPlus, DollarSign, Clock, Eye, Building2, Target, Gift } from 'lucide-react';
import { format } from 'date-fns';
import type { Job } from '@/types';

// Local mock data
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    description: 'We are looking for an experienced software engineer to join our team.',
    requirements: ['React', 'TypeScript', '5+ years experience'],
    location: 'San Francisco, CA',
    department: 'Engineering',
    salary: '₹90,00,000 - ₹1,35,00,000',
    experience: '5+ years',
    openPositions: 2,
    totalPositions: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'active'
  },
  {
    id: '2',
    title: 'Product Manager',
    description: 'Lead product strategy and development for our core platform.',
    requirements: ['Product Management', 'Agile', '3+ years experience'],
    location: 'New York, NY',
    department: 'Product',
    salary: '₹75,00,000 - ₹1,05,00,000',
    experience: '3-5 years',
    openPositions: 1,
    totalPositions: 1,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    status: 'active'
  }
];

interface JobBrowserProps {
  onReferClick: (jobId: string) => void;
}

const JobBrowser: React.FC<JobBrowserProps> = ({ onReferClick }) => {
  const [jobs] = useState<Job[]>(mockJobs);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const activeJobs = jobs.filter(job => job.status === 'active');
  
  const filteredJobs = activeJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.requirements.some(req => req.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(activeJobs.map(job => job.department))];

  const handleViewDetails = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search and Filter */}
      <Card className="glass border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by job title, description, or requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/70 border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/70 border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
        Showing <span className="font-semibold text-blue-800">{filteredJobs.length}</span> of <span className="font-semibold text-blue-800">{activeJobs.length}</span> available positions
      </div>

      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <Card className="glass border-0 shadow-xl animate-fade-in">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-500 text-lg">
                  {searchQuery || departmentFilter !== 'all' 
                    ? 'No jobs match your search criteria.' 
                    : 'No active job postings available.'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job, index) => (
            <Card 
              key={job.id} 
              className="card-hover glass border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4 bg-gradient-to-r from-white/50 to-green-50/30 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-800 transition-colors duration-300">
                        {job.title}
                      </CardTitle>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm text-gray-600">
                      <span className="flex items-center space-x-1 bg-white/70 px-2 py-1 rounded-lg">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center space-x-1 bg-white/70 px-2 py-1 rounded-lg">
                        <Target className="h-4 w-4 text-green-500" />
                        <span>{job.department}</span>
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
                        <span>{format(job.createdAt, 'MMM d, yyyy')}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-3">
                    <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 shadow-sm font-medium px-3 py-1">
                      <Users className="h-3 w-3 mr-1" />
                      {job.openPositions} positions
                    </Badge>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleViewDetails(job.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        onClick={() => onReferClick(job.id)}
                        size="sm"
                        className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Refer Someone
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-6">
                <div className="bg-gradient-to-r from-gray-50 to-green-50/30 p-4 rounded-xl">
                  <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-green-500" />
                    Requirements:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, reqIndex) => (
                      <Badge 
                        key={req} 
                        variant="secondary" 
                        className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 hover:scale-105 transition-transform duration-200"
                        style={{ animationDelay: `${reqIndex * 50}ms` }}
                      >
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200/50 animate-pulse-slow">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                      <Gift className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-orange-800">
                        💰 Referral Bonus: Earn ₹75,000
                      </p>
                      <p className="text-xs text-orange-700">
                        When your referral gets hired and stays for 6 months
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default JobBrowser;