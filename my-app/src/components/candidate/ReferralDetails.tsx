import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Calendar } from "lucide-react";

type ReferralData = {
  candidateName: string;
  position: string;
  referredBy: string;
  submittedDate: string;
};

export default function ReferralDetails({ data }: { data: ReferralData }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="mb-5">
        <CardTitle className="text-2xl flex items-center gap-2">
          <User className="h-5 w-5" />
          Application Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Candidate</p>
          <p className="text-gray-600">{data.candidateName}</p>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium text-gray-900">Position</p>
          <p className="text-gray-600">{data.position}</p>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium text-gray-900">Referred By</p>
          <p className="text-gray-600">{data.referredBy}</p>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium text-gray-900">Submitted</p>
          <p className="text-gray-600 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {data.submittedDate}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
