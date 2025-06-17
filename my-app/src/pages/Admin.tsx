import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Briefcase, Users, TrendingUp, AlertCircle, BarChart3, Sparkles } from 'lucide-react';

import type { Job, Referral, Bonus } from '@/types';
import ReferralManagement from '@/components/admin/RefferalManagement';
import JobList from '@/components/admin/JobList';
import JobForm from '@/components/admin/JobForm';
import BonusManagement from '@/components/admin/Bonus';

// Local mock data
const initialJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    description: 'We are looking for an experienced software engineer to join our team.',
    requirements: ['React', 'TypeScript', '5+ years experience'],
    location: 'San Francisco, CA',
    
    salary: '₹90,00,000 - ₹1,35,00,000',
    experience: '5+ years',
    openPositions: 2,
    totalPositions: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'active',
     numOfPositions: 3,
    bonusForReferral: 5000,
    skills: "AI/ML",
  },
  {
    id: '2',
    title: 'Product Manager',
    description: 'Lead product strategy and development for our core platform.',
    requirements: ['Product Management', 'Agile', '3+ years experience'],
    location: 'New York, NY',
    salary: '₹75,00,000 - ₹1,05,00,000',
    experience: '3-5 years',
    openPositions: 1,
    totalPositions: 1,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    status: 'active',
     numOfPositions: 3,
    bonusForReferral: 5000,
    skills: "AI/ML",
  }
];

const initialReferrals: Referral[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Senior Software Engineer',
    referrerId: '1',
    referrerName: 'John Doe',
    candidateName: 'Jane Smith',
    candidateEmail: 'jane.smith@email.com',
    candidatePhone: '+1-555-0123',
    status: 'under_review',
    submittedAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-17'),
    referralCode: 'REF-001',
    bonusEligible: false,
    bonusPaid: false
  }
];

const initialBonuses: Bonus[] = [];

const AdminDashboard: React.FC = () => {
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals);
  const [bonuses, setBonuses] = useState<Bonus[]>(initialBonuses);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newJob: Job = {
      ...jobData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setJobs(prev => [...prev, newJob]);
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => 
      job.id === id ? { ...job, ...updates, updatedAt: new Date() } : job
    ));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  const updateReferral = (id: string, updates: Partial<Referral>) => {
    setReferrals(prev => prev.map(referral => 
      referral.id === id ? { ...referral, ...updates, updatedAt: new Date() } : referral
    ));
  };

  const activeJobs = jobs.filter(job => job.status === 'active').length;
  const totalReferrals = referrals.length;
  const pendingReferrals = referrals.filter(r => r.status === 'submitted' || r.status === 'under_review').length;
  const eligibleBonuses = bonuses.filter(b => b.status === 'eligible').length;

  const stats = [
    {
      title: 'Active Jobs',
      value: activeJobs,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      trend: '+12%'
    },
    {
      title: 'Total Referrals',
      value: totalReferrals,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      trend: '+8%'
    },
    {
      title: 'Pending Reviews',
      value: pendingReferrals,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      trend: '-3%'
    },
    {
      title: 'Eligible Bonuses',
      value: eligibleBonuses,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      trend: '+15%'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 text-white animate-scale-in">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='60' cy='60' r='30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-purple-200 text-lg">Manage jobs, referrals, and bonuses with ease</p>
              </div>
            </div>
          </div>
          <div className="animate-float">
            <Sparkles className="h-12 w-12 text-purple-300 opacity-60" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className={`card-hover glass border-0 ${stat.bgColor} animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {stat.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <div className="animate-slide-in-right" style={{ animationDelay: '400ms' }}>
        <Tabs defaultValue="jobs" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 w-fit bg-white/70 backdrop-blur-sm border shadow-lg rounded-xl p-1">
              <TabsTrigger 
                value="jobs" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                Job Management
              </TabsTrigger>
              <TabsTrigger 
                value="referrals"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all duration-300"
              >
                Referrals
              </TabsTrigger>
              <TabsTrigger 
                value="bonuses"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
              >
                Bonuses
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jobs" className="space-y-6 animate-fade-in">
            <Card className="glass border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-gray-900">Job Postings</CardTitle>
                    <p className="text-gray-600 mt-1">Create and manage job opportunities</p>
                  </div>
                  <EnhancedButton 
                    onClick={() => setShowJobForm(true)}
                    className="shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Job
                  </EnhancedButton>
                </div>
              </CardHeader>
              
              {showJobForm && (
                <CardContent className="border-t bg-gradient-to-br from-gray-50 to-white animate-scale-in">
                  <div className="pt-6">
                    <JobForm 
                      onCancel={() => setShowJobForm(false)} 
                    />
                  </div>
                </CardContent>
              )}
            </Card>
            
            <div className="animate-slide-in-right" style={{ animationDelay: '200ms' }}>
              <JobList />
            </div>
          </TabsContent>

          <TabsContent value="referrals" className="animate-fade-in">
            <div className="animate-slide-in-right">
              <ReferralManagement />
            </div>
          </TabsContent>

          <TabsContent value="bonuses" className="animate-fade-in">
            <div className="animate-slide-in-right">
              <BonusManagement />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;