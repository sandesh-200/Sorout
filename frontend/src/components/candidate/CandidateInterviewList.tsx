import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar, Briefcase, AlertCircle, PlayCircle, CheckCircle2, XCircle, Star } from "lucide-react";
import type { CandidateInterview, InterviewSessionStatus } from "@/features/candidate/candidateTypes";

// Maps status values to user-friendly text, styling, and icons
const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ComponentType<any> }> = {
  not_started: { label: "Not Started", variant: "secondary", icon: PlayCircle },
  ongoing: { label: "Ongoing", variant: "default", icon: PlayCircle },
  completed: { label: "Completed", variant: "outline", icon: CheckCircle2 },
  evaluated: { label: "Evaluated", variant: "outline", icon: Star },
  cancelled: { label: "Cancelled", variant: "destructive", icon: XCircle },
};

// Fallback for any unknown status that might come from the backend
const defaultStatusConfig = { label: "Unknown", variant: "secondary" as const, icon: PlayCircle };

interface InterviewListProps {
  interviews: CandidateInterview[];
  isLoading: boolean;
  error: string | null;
  onActionClick?: (interview: CandidateInterview) => void;
}

export const CandidateInterviewList: React.FC<InterviewListProps> = ({
  interviews,
  isLoading,
  error,
  onActionClick,
}) => {
  // 1. Error State
  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Interviews</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // 2. Loading State (Skeleton Grid)
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // 3. Empty State
  if (interviews.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground stroke-1" />
        <h3 className="mt-4 text-lg font-semibold">No interviews scheduled</h3>
        <p className="text-sm text-muted-foreground mt-1">You aren't currently enrolled in any upcoming interview sessions.</p>
      </div>
    );
  }

  // 4. Data State
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {interviews.map((interview) => {
        const config = statusConfig[interview.status] ?? defaultStatusConfig;
        const StatusIcon = config.icon;
        const formattedDate = new Date(interview.enrolled_at).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        return (
          <Card key={interview.session_id} className="flex flex-col justify-between transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {interview.seniority_level}
                </span>
                <Badge variant={config.variant} className="flex items-center gap-1 shrink-0">
                  <StatusIcon className="h-3 w-3" />
                  {config.label}
                </Badge>
              </div>
              <CardTitle className="text-xl line-clamp-1 mt-1">{interview.title}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 mt-1">
                <Briefcase className="h-3.5 w-3.5" />
                {interview.job_position}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Enrolled: {formattedDate}</span>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              {onActionClick && (
                <Button 
                  className="w-full" 
                  variant={interview.status === "not_started" || interview.status === "ongoing" ? "default" : "secondary"}
                  disabled={interview.status === "cancelled"}
                  onClick={() => onActionClick(interview)}
                >
                  {interview.status === "ongoing" ? "Resume Interview" : "Start Interview"}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};