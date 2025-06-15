import { CheckCircle, Clock, AlertCircle } from "lucide-react";

type Step = {
  name: string;
  status: "completed" | "current" | "pending";
  date: string;
};

function getStatusIcon(step: Step) {
  if (step.status === "completed")
    return <CheckCircle className="h-5 w-5 text-green-600" />;
  if (step.status === "current")
    return <Clock className="h-5 w-5 text-blue-600" />;
  // pending
  return <AlertCircle className="h-5 w-5 text-gray-400" />;
}

export default function ReferralTimeline({
  steps,
  largerFont,
}: {
  steps: Step[];
  largerFont?: boolean;
}) {
  return (
    <div className="space-y-5">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">{getStatusIcon(step)}</div>
          <div className="flex-1 min-w-0">
            <div
              className={`flex items-center justify-between ${
                largerFont ? "text-lg" : "text-base"
              } mb-1`}
            >
              <p
                className={`font-medium ${
                  step.status === "completed"
                    ? "text-green-800"
                    : step.status === "current"
                    ? "text-blue-800"
                    : "text-gray-600"
                }`}
              >
                {step.name}
              </p>
              <p className="text-xs text-gray-500">{step.date}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="mt-2 ml-2 w-px h-6 bg-gray-200"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
