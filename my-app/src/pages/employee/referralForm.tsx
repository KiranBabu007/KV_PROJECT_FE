import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X, Copy, Check } from "lucide-react";
import type { Job, Referral, User } from "@/types";
import {
  useGetResumeQuery,
  useSendResumeMutation,
} from "@/api-service/resume/resume.api";

// Local mock data
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    description:
      "We are looking for an experienced software engineer to join our team.",
    requirements: ["React", "TypeScript", "5+ years experience"],
    location: "San Francisco, CA",
    department: "Engineering",
    salary: "₹90,00,000 - ₹1,35,00,000",
    experience: "5+ years",
    openPositions: 2,
    totalPositions: 3,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    status: "active",
  },
  {
    id: "2",
    title: "Product Manager",
    description: "Lead product strategy and development for our core platform.",
    requirements: ["Product Management", "Agile", "3+ years experience"],
    location: "New York, NY",
    department: "Product",
    salary: "₹75,00,000 - ₹1,05,00,000",
    experience: "3-5 years",
    openPositions: 1,
    totalPositions: 1,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    status: "active",
  },
];

const mockReferrals: Referral[] = [
  {
    id: "1",
    jobId: "1",
    jobTitle: "Senior Software Engineer",
    referrerId: "1",
    referrerName: "John Doe",
    candidateName: "Jane Smith",
    candidateEmail: "jane.smith@email.com",
    candidatePhone: "+1-555-0123",
    status: "under_review",
    submittedAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-17"),
    referralCode: "REF-001",
    bonusEligible: false,
    bonusPaid: false,
    // trackingToken: 'sample-token-123'
  },
];

interface ReferralFormProps {
  jobId: string;
  jobs: any[];
  user: User;
  onCancel?: () => void;
}

const ReferralForm: React.FC<ReferralFormProps> = ({
  jobId,
  jobs,
  user,
  onCancel,
}) => {
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals);
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    notes: "",
  });

  // const {data:resumeFile} = useGetResumeQuery(id)
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [sendResume] = useSendResumeMutation();
  const [loading, setLoading] = useState(false);
  const [trackingLink, setTrackingLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const job = jobs.find((j) => j.id === jobId);

  if (!job || !user) return null;

  // Check if user has already referred someone for this job within 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const hasRecentReferral = referrals.some(
    (r) =>
      r.jobId === jobId &&
      r.referrerId === user.id &&
      r.submittedAt > sixMonthsAgo
  );

  const generateUniqueToken = () => {
    return Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
  };

  const addReferral = (
    referralData: Omit<
      Referral,
      "id" | "submittedAt" | "updatedAt" | "referralCode" | "trackingToken"
    >
  ) => {
    const trackingToken = generateUniqueToken();
    const newReferral: Referral = {
      ...referralData,
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date(),
      updatedAt: new Date(),
      referralCode: `REF-${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`,
      trackingToken,
    };
    setReferrals((prev) => [...prev, newReferral]);
    return trackingToken;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.includes("document")) {
        setResumeFile(file);
        setErrorMessage(null);
        try {
          const formData = new FormData();
          formData.append("resume", file);

          const response = await sendResume(formData).unwrap();
          if (response && response.id) {
            setSuccessMessage("Resume uploaded successfully");
            setTimeout(() => setSuccessMessage(null), 3000);
          }
        } catch (error) {
          setErrorMessage("Failed to upload resume. Please try again.");
        }
      } else {
        setErrorMessage("Please upload a PDF or Word document.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      // Check for duplicate email
      const existingReferral = referrals.find(
        (r) => r.candidateEmail === formData.candidateEmail && r.jobId === jobId
      );

      if (existingReferral) {
        setErrorMessage("This candidate has already been referred for this position.");
        return;
      }

      const trackingToken = addReferral({
        jobId,
        jobTitle: job.title,
        referrerId: user.id,
        referrerName: user.name,
        candidateName: formData.candidateName,
        candidateEmail: formData.candidateEmail,
        candidatePhone: formData.candidatePhone,
        status: "submitted",
        bonusEligible: false,
        bonusPaid: false,
        notes: formData.notes,
        resumeUrl: resumeFile
          ? `resume-${Date.now()}-${resumeFile.name}`
          : undefined,
      });

      // Generate tracking link
      const link = `${window.location.origin}/track/${trackingToken}`;
      setTrackingLink(link);

      setSuccessMessage("Referral submitted successfully!");
      
      // Reset form except tracking link
      setFormData({
        candidateName: "",
        candidateEmail: "",
        candidatePhone: "",
        notes: "",
      });
      setResumeFile(null);
    } catch (error) {
      setErrorMessage("Failed to submit referral. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (hasRecentReferral) {
    return (
      <div className="text-center py-8">
        <X className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Cannot Submit Referral
        </h3>
        <p className="text-gray-600 mb-6">
          You have already referred someone for this position within the last 6
          months.
        </p>
        <Button variant="outline" onClick={onCancel}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  if (trackingLink) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Referral Submitted Successfully!
          </h3>
          <p className="text-gray-600 mb-6">
            Share this unique tracking link with{" "}
            <strong>{formData.candidateName || "the candidate"}</strong> so they
            can track their application status:
          </p>

          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm text-gray-700 break-all flex-1">
                {trackingLink}
              </code>
              <Button
                onClick={() => copyToClipboard(trackingLink)}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                {linkCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-blue-900 mb-2">
              What the candidate can see:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Current application status</li>
              <li>• Status update history</li>
              <li>• Interview scheduling information</li>
              <li>• Important notifications</li>
            </ul>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => {
                setTrackingLink(null);
                onCancel?.();
              }}
            >
              Submit Another Referral
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Back to Jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900">
          Referring for: {job.title}
        </h3>
        <p className="text-sm text-blue-800 mt-1">
          {job.department} • {job.location}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Add this error and success message box above the form fields */}
        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="candidateName">Candidate Name *</Label>
            <Input
              id="candidateName"
              value={formData.candidateName}
              onChange={(e) =>
                setFormData({ ...formData, candidateName: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidateEmail">Email Address *</Label>
            <Input
              id="candidateEmail"
              type="email"
              value={formData.candidateEmail}
              onChange={(e) =>
                setFormData({ ...formData, candidateEmail: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="candidatePhone">Phone Number *</Label>
            <Input
              id="candidatePhone"
              type="tel"
              value={formData.candidatePhone}
              onChange={(e) =>
                setFormData({ ...formData, candidatePhone: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume">Resume Upload</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {resumeFile ? (
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm">{resumeFile.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setResumeFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload candidate's resume
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <Label htmlFor="resume-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm">
                    Choose File
                  </Button>
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  PDF or Word documents only
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            rows={3}
            placeholder="Why do you think this candidate would be a great fit? (Optional)"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">
            Referral Policy Reminder
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>
              • You cannot refer the same person for the same position within 6
              months
            </li>
            <li>
              • Bonus eligibility begins 6 months after the candidate's start
              date
            </li>
            <li>• Standard referral bonus is ₹75,000 for successful hires</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Referral"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReferralForm;
