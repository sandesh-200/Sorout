import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type StatusCount } from "@/features/dashboard/dashboardTypes";

interface InterviewStatusCardProps {
  interviewStatuses: StatusCount[];
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  ready: "Ready",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const CandidateFunnelCard: React.FC<InterviewStatusCardProps> = ({ interviewStatuses }) => {
  const total = Math.max(
    interviewStatuses.reduce((sum, s) => sum + s.count, 0),
    1
  );

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Interview Status Breakdown</CardTitle>
        <CardDescription>Distribution across all interview templates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {interviewStatuses.map((item) => (
          <div key={item.status} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{STATUS_LABELS[item.status] ?? item.status}</span>
              <span className="text-muted-foreground">{item.count}</span>
            </div>
            <Progress value={(item.count / total) * 100} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};