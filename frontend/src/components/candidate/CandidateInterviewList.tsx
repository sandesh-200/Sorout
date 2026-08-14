// import React from "react";
// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import {
//   Calendar,
//   Briefcase,
//   AlertCircle,
//   PlayCircle,
//   CheckCircle2,
//   XCircle,
//   Star,
// } from "lucide-react";
// import type { CandidateInterview } from "@/features/candidate/candidateTypes";

// const statusConfig: Record<
//   string,
//   {
//     label: string;
//     variant: "default" | "secondary" | "outline" | "destructive";
//     icon: React.ComponentType<{ className?: string }>;
//   }
// > = {
//   not_started: { label: "Not Started", variant: "secondary", icon: PlayCircle },
//   ongoing: { label: "Ongoing", variant: "default", icon: PlayCircle },
//   completed: { label: "Completed", variant: "outline", icon: CheckCircle2 },
//   evaluated: { label: "Evaluated", variant: "outline", icon: Star },
//   cancelled: { label: "Cancelled", variant: "destructive", icon: XCircle },
// };

// const defaultStatusConfig = {
//   label: "Unknown",
//   variant: "secondary" as const,
//   icon: PlayCircle,
// };

// function getActionButtonText(status: string): string {
//   switch (status) {
//     case "ongoing":
//       return "Resume Interview";
//     case "not_started":
//       return "Start Interview";
//     case "completed":
//     case "evaluated":
//       return "View Results";
//     case "cancelled":
//       return "Cancelled";
//     default:
//       return "View Details";
//   }
// }

// function formatDate(dateString: string): string {
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "N/A";
//     return date.toLocaleDateString(undefined, {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   } catch {
//     return "N/A";
//   }
// }

// interface InterviewListProps {
//   interviews: CandidateInterview[];
//   isLoading: boolean;
//   error: string | null;
//   onActionClick?: (interview: CandidateInterview) => void;
// }

// export const CandidateInterviewList: React.FC<InterviewListProps> = ({
//   interviews,
//   isLoading,
//   error,
//   onActionClick,
// }) => {
//   // 1. Error State
//   if (error) {
//     return (
//       <Alert variant="destructive" className="max-w-2xl mx-auto my-4">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Error Loading Interviews</AlertTitle>
//         <AlertDescription>{error}</AlertDescription>
//       </Alert>
//     );
//   }

//   // 2. Loading State (Skeleton Grid)
//   if (isLoading) {
//     return (
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {Array.from({ length: 3 }).map((_, index) => (
//           <Card key={index} className="flex flex-col justify-between">
//             <CardHeader className="space-y-2">
//               <Skeleton className="h-3 w-1/4" />
//               <Skeleton className="h-6 w-3/4" />
//               <Skeleton className="h-4 w-1/2" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-4 w-full" />
//             </CardContent>
//             <CardFooter>
//               <Skeleton className="h-9 w-full" />
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     );
//   }

//   // 3. Empty State
//   if (interviews.length === 0) {
//     return (
//       <div className="text-center py-12 px-4 border border-dashed rounded-lg bg-muted/20">
//         <Briefcase className="mx-auto h-10 w-10 text-muted-foreground/60 stroke-1" />
//         <h3 className="mt-3 text-base font-medium text-foreground">
//           No interviews scheduled
//         </h3>
//         <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
//           You aren't currently enrolled in any upcoming interview sessions.
//         </p>
//       </div>
//     );
//   }

//   // 4. Data State
//   return (
//     <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
//       {interviews.map((interview) => {
//         const config = statusConfig[interview.status] ?? defaultStatusConfig;
//         const StatusIcon = config.icon;
//         const formattedDate = formatDate(interview.enrolled_at);
//         const actionLabel = getActionButtonText(interview.status);

//         return (
//           <li key={interview.session_id} className="flex">
//             <Card className="flex flex-col justify-between w-full transition-colors duration-150 hover:border-foreground/20">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between gap-2 mb-1.5">
//                   <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
//                     {interview.seniority_level}
//                   </span>
//                   <Badge
//                     variant={config.variant}
//                     className="flex items-center gap-1 shrink-0 font-normal text-xs px-2 py-0.5"
//                   >
//                     <StatusIcon className="h-3 w-3" />
//                     {config.label}
//                   </Badge>
//                 </div>

//                 <CardTitle className="text-lg font-semibold line-clamp-1 leading-snug">
//                   {interview.title}
//                 </CardTitle>

//                 <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
//                   <Briefcase className="h-3.5 w-3.5 shrink-0" />
//                   <span className="truncate">{interview.job_position}</span>
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="pb-4 text-xs text-muted-foreground">
//                 <div className="flex items-center gap-1.5">
//                   <Calendar className="h-3.5 w-3.5 shrink-0" />
//                   <span>Enrolled: {formattedDate}</span>
//                 </div>
//               </CardContent>

//               <CardFooter className="pt-0">
//                 {onActionClick && (
//                   <Button
//                     className="w-full text-xs font-medium"
//                     size="sm"
//                     variant={
//                       interview.status === "not_started" ||
//                       interview.status === "ongoing"
//                         ? "default"
//                         : "outline"
//                     }
//                     disabled={interview.status === "cancelled"}
//                     onClick={() => onActionClick(interview)}
//                     aria-label={`${actionLabel} for ${interview.title}`}
//                   >
//                     {actionLabel}
//                   </Button>
//                 )}
//               </CardFooter>
//             </Card>
//           </li>
//         );
//       })}
//     </ul>
//   );
// };


import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Briefcase,
  AlertCircle,
  Play,
  CheckCircle2,
  XCircle,
  Star,
  ArrowRight,
  Clock,
  Search,
  ChevronRight,
} from "lucide-react";
import type { CandidateInterview } from "@/features/candidate/candidateTypes";

const statusConfig: Record<
  string,
  {
    label: string;
    indicatorColor: string;
    badgeStyle: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  not_started: {
    label: "Not Started",
    indicatorColor: "bg-blue-500",
    badgeStyle:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    icon: Clock,
  },
  ongoing: {
    label: "In Progress",
    indicatorColor: "bg-emerald-500 animate-pulse",
    badgeStyle:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-medium",
    icon: Play,
  },
  completed: {
    label: "Completed",
    indicatorColor: "bg-slate-400 dark:bg-slate-500",
    badgeStyle: "bg-muted text-muted-foreground border-border",
    icon: CheckCircle2,
  },
  evaluated: {
    label: "Evaluated",
    indicatorColor: "bg-amber-500",
    badgeStyle:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    icon: Star,
  },
  cancelled: {
    label: "Cancelled",
    indicatorColor: "bg-destructive",
    badgeStyle: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
};

const defaultStatusConfig = {
  label: "Unknown",
  indicatorColor: "bg-muted-foreground",
  badgeStyle: "bg-muted text-muted-foreground border-border",
  icon: Clock,
};

function getActionButtonDetails(status: string) {
  switch (status) {
    case "ongoing":
      return { label: "Resume", variant: "default" as const, active: true };
    case "not_started":
      return { label: "Start Interview", variant: "default" as const, active: true };
    case "completed":
    case "evaluated":
      return { label: "View Results", variant: "outline" as const, active: false };
    case "cancelled":
      return { label: "Cancelled", variant: "ghost" as const, active: false };
    default:
      return { label: "View Details", variant: "outline" as const, active: false };
  }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

type FilterTab = "all" | "active" | "completed";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      if (activeTab === "active") {
        if (interview.status !== "not_started" && interview.status !== "ongoing") {
          return false;
        }
      } else if (activeTab === "completed") {
        if (interview.status !== "completed" && interview.status !== "evaluated") {
          return false;
        }
      }

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        interview.title.toLowerCase().includes(query) ||
        interview.job_position.toLowerCase().includes(query) ||
        interview.seniority_level.toLowerCase().includes(query)
      );
    });
  }, [interviews, activeTab, searchQuery]);

  // 1. Error State
  if (error) {
    return (
      <Alert variant="destructive" className="my-4 border-destructive/30">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Interviews</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="w-full divide-y divide-border/60">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 3. Overall Empty State
  if (interviews.length === 0) {
    return (
      <div className="text-center py-16 px-4 border border-dashed rounded-lg text-muted-foreground">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
          <Briefcase className="h-6 w-6 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-foreground tracking-tight">
          No interviews scheduled
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
          You aren't currently enrolled in any assessment sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Upper Filtering Controls (Preserved) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="inline-flex items-center p-0.5 rounded-lg bg-muted/60 border border-border/50 text-xs font-medium text-muted-foreground">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "hover:text-foreground"
            }`}
          >
            All ({interviews.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "active"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "hover:text-foreground"
            }`}
          >
            Active (
            {
              interviews.filter(
                (i) => i.status === "not_started" || i.status === "ongoing"
              ).length
            }
            )
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "completed"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "hover:text-foreground"
            }`}
          >
            Completed (
            {
              interviews.filter(
                (i) => i.status === "completed" || i.status === "evaluated"
              ).length
            }
            )
          </button>
        </div>

        {/* Search Input */}
        {interviews.length > 3 && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
            <Input
              type="search"
              placeholder="Filter session title or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-background border-border hover:bg-muted/30 focus-visible:bg-background transition-colors"
            />
          </div>
        )}
      </div>

      {/* Filtered Empty State */}
      {filteredInterviews.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed rounded-lg text-muted-foreground">
          <p className="text-sm">No interviews match your selected filter or query.</p>
        </div>
      ) : (
        /* Page-Level Borderless Rows */
        <ul className="w-full divide-y divide-border/60 list-none p-0 m-0 border-t border-b border-border/60">
          {filteredInterviews.map((interview) => {
            const config = statusConfig[interview.status] ?? defaultStatusConfig;
            const formattedDate = formatDate(interview.enrolled_at);
            const action = getActionButtonDetails(interview.status);

            return (
              <li
                key={interview.session_id}
                className="group flex flex-col md:flex-row md:items-center justify-between py-4 px-1 sm:px-2 gap-4 hover:bg-muted/20 transition-colors rounded-sm"
              >
                {/* Left Column: Title, Position, Level Badge */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors truncate">
                      {interview.title}
                    </h4>

                    {/* Seniority Pill */}
                    <span className="inline-flex items-center text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded border border-border/80 bg-muted/50 text-muted-foreground">
                      {interview.seniority_level}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1.5 font-medium text-foreground/80 truncate">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                      {interview.job_position}
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                      Enrolled {formattedDate}
                    </span>
                  </div>
                </div>

                {/* Right Column: Status & Action Button */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
                  {/* Status Badge */}
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1.5 font-normal text-xs px-2.5 py-1 rounded-md border ${config.badgeStyle}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${config.indicatorColor}`}
                    />
                    {config.label}
                  </Badge>

                  {/* Action Button */}
                  {onActionClick && (
                    <Button
                      size="sm"
                      variant={action.variant}
                      disabled={interview.status === "cancelled"}
                      onClick={() => onActionClick(interview)}
                      className={`h-8 text-xs font-medium gap-1.5 px-3 transition-all ${
                        action.active
                          ? "shadow-xs hover:gap-2"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      aria-label={`${action.label} for ${interview.title}`}
                    >
                      <span>{action.label}</span>
                      {action.active ? (
                        <ArrowRight className="h-3.5 w-3.5 transition-transform" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};