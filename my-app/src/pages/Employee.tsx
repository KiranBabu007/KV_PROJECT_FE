import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  UserPlus,
  Briefcase,
  Gift,
  Clock,
  Search,
  MapPin,
  DollarSign,
  Bell,
  User,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@radix-ui/react-label";
const EmployeeDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // Referral form state
  const [referForm, setReferForm] = useState(false);
  const [refName, setRefName] = useState("");
  const [refEmail, setRefEmail] = useState("");
  const [refPhone,setRefPhone]=useState("")
  const [refNote, setRefNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Mock data
  const mockNotifications = [
    {
      id: 1,
      title: "Interview Reminder",
      message: "Your technical interview is scheduled for tomorrow at 2:00 PM.",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Application Status Update",
      message: "Your application has moved to the interview stage.",
      time: "1 day ago",
    },
  ];

  const stats = [
    {
      title: "My Referrals",
      value: "8",
      icon: UserPlus,
      change: "+2 this month",
      color: "text-blue-600",
    },
    {
      title: "Successful Hires",
      value: "3",
      icon: Gift,
      change: "+1 this month",
      color: "text-green-600",
    },
    {
      title: "Pending Reviews",
      value: "2",
      icon: Clock,
      change: "Under review",
      color: "text-orange-600",
    },
    {
      title: "Bonus Earned",
      value: "$4,500",
      icon: DollarSign,
      change: "Last 6 months",
      color: "text-purple-600",
    },
  ];

  const availableJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      salary: "$120k - $160k",
      openings: 2,
      description:
        "We are looking for an experienced frontend developer to join our team...",
      requirements: ["React", "TypeScript", "5+ years experience"],
      referralBonus: "$2,000",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      salary: "$130k - $170k",
      openings: 1,
      description: "Join our product team to drive innovation and growth...",
      requirements: ["Product Management", "Analytics", "3+ years experience"],
      referralBonus: "$2,500",
    },
    {
      id: 3,
      title: "Data Scientist",
      department: "Analytics",
      location: "Remote",
      salary: "$110k - $150k",
      openings: 3,
      description:
        "Help us make data-driven decisions across the organization...",
      requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
      referralBonus: "$2,000",
    },
  ];

  const myReferrals = [
    {
      id: 1,
      candidate: "Alice Johnson",
      job: "Senior Frontend Developer",
      status: "under-review",
      date: "2024-01-15",
      bonus: "$2,000",
    },
    {
      id: 2,
      candidate: "Bob Smith",
      job: "Product Manager",
      status: "hired",
      date: "2024-01-10",
      bonus: "$2,500",
    },
    {
      id: 3,
      candidate: "Charlie Brown",
      job: "Data Scientist",
      status: "declined",
      date: "2024-01-08",
      bonus: "$2,000",
    },
    {
      id: 4,
      candidate: "Diana Ross",
      job: "Frontend Developer",
      status: "interview",
      date: "2024-01-12",
      bonus: "$2,000",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "under-review":
        return "bg-purple-100 text-purple-800";
      case "interview":
        return "bg-yellow-100 text-yellow-800";
      case "hired":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredJobs = availableJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const hasNotifications = mockNotifications.length > 0;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mt-3 ml-2">
            Employee Dashboard
          </h1>
          <p className="text-gray-600 ml-2">
            Refer great candidates and track your referrals
          </p>
        </div>
        {/* <Popover>
          <PopoverTrigger className="mr-5 ">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              {hasNotifications && (
                <span className="absolute -top-1.5 -right-1.5 inline-block h-3 w-3 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="max-h-72 overflow-y-auto divide-y">
              {mockNotifications.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center">
                  No notifications.
                </div>
              ) : (
                mockNotifications.map((notification) => (
                  <div className={"px-4 py-3 hover:bg-gray-100"}>
                    <div className="font-semibold text-gray-900 text-sm">
                      {notification.title}
                    </div>
                    <div className="text-sm text-gray-700">
                      {notification.message}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {notification.time}
                    </div>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ml-2 mr-2">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="jobs" className="space-y-6 ml-2 mr-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
          <TabsTrigger value="referrals">My Referrals</TabsTrigger>
        </TabsList>
        {/* for candidate form */}
        {referForm && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Refer a Candidate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="refName">Candidate Name</Label>
                    <Input
                      id="refName"
                      value={refName}
                      onChange={(e) => setRefName(e.target.value)}
                      required
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="refEmail">Email</Label>
                    <Input
                      id="refEmail"
                      type="email"
                      value={refEmail}
                      onChange={(e) => setRefEmail(e.target.value)}
                      required
                      placeholder="Email address"
                    />
                  </div>
                    <div>
                    <Label htmlFor="refEmail">Phone Number</Label>
                    <Input
                      id="refPhone"
                      type="text"
                      value={refPhone}
                      onChange={(e) => setRefPhone(e.target.value)}
                      required
                      placeholder="phone"
                    />
                  </div>
                  <div>
                <Label htmlFor="resumeUpload" className="block mb-1">Resume (PDF or DOC/DOCX)</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="resumeUpload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                  
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
            </div>
                  <div>
                    <Label htmlFor="refNote">Note (optional)</Label>
                    <Input
                      id="refNote"
                      value={refNote}
                      onChange={(e) => setRefNote(e.target.value)}
                      placeholder="Recommendation note"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={isSubmitting}
                      onClick={() => setReferForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Referral"}
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        )}
        {!referForm && (
          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Open Positions</CardTitle>
                    <CardDescription>
                      Find great opportunities to refer your network
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                {job.department}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salary}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">
                              {job.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {job.requirements.map((req, index) => (
                                <Badge key={index} variant="secondary">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="text-right ml-6">
                            <Button
                              className="w-full"
                              onClick={() => setReferForm(true)}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Refer Friend
                            </Button>
                            <div className="flex items-center  gap-1 mt-5 border-2 justify-items-center rounded-2xl">
                              <User className="h-4 w-4 mr-2  ml-1.5" />{" "}
                              <p className="font-medium">{job.openings}</p>
                              <p className="font-medium">Positions</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-5">
                              <p className="text-sm text-green-600 font-medium">
                                Referral Bonus
                              </p>
                              <p className="text-lg font-bold text-green-800 ">
                                {job.referralBonus}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Referrals</CardTitle>
              <CardDescription>
                Track the status of your referrals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myReferrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {referral.candidate}
                      </h3>
                      <p className="text-sm text-gray-600">{referral.job}</p>
                      <p className="text-xs text-gray-500">
                        Referred on {referral.date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          {referral.bonus}
                        </p>
                        <p className="text-xs text-gray-500">Bonus</p>
                      </div>
                      <Badge className={getStatusColor(referral.status)}>
                        {referral.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
