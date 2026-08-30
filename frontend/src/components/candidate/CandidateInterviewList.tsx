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
import type { CandidateInterview } from "@/features/interview/interviewTypes";

type FilterTab = "all" | "active" | "completed";

// --- Status Configurations ---
const STATUS_CONFIG: Record<
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
    badgeStyle: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    icon: Clock,
  },
  ongoing: {
    label: "In Progress",
    indicatorColor: "bg-emerald-500 animate-pulse",
    badgeStyle: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-medium",
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
    badgeStyle: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    icon: Star,
  },
  cancelled: {
    label: "Cancelled",
    indicatorColor: "bg-destructive",
    badgeStyle: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
};

const DEFAULT_STATUS_CONFIG = {
  label: "Unknown",
  indicatorColor: "bg-muted-foreground",
  badgeStyle: "bg-muted text-muted-foreground border-border",
  icon: Clock,
};

// --- Helper Functions ---
function getActionButtonDetails(status: string) {
  switch (status) {
    case "ongoing":
      return { label: "Resume", variant: "default" as const, active: true };
    case "not_started":
      return { label: "Start Interview", variant: "default" as const, active: true };
    case "completed":
      return { label: "View Results", variant: "outline" as const, active: false };
    case "evaluated":
      return { label: "View Results", variant: "default" as const, active: true };
    case "cancelled":
      return { label: "Cancelled", variant: "ghost" as const, active: false };
    default:
      return { label: "View Details", variant: "outline" as const, active: false };
  }
}

function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
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

// --- Individual Row Component ---
interface InterviewListItemProps {
  interview: CandidateInterview;
  onActionClick?: (interview: CandidateInterview) => void;
}

const InterviewListItem: React.FC<InterviewListItemProps> = React.memo(({ interview, onActionClick }) => {
  const config = STATUS_CONFIG[interview.status] ?? DEFAULT_STATUS_CONFIG;
  const formattedDate = formatDate(interview.enrolled_at);
  const action = getActionButtonDetails(interview.status);
  const isCancelled = interview.status === "cancelled";

  return (
    <li className="group flex flex-col md:flex-row md:items-center justify-between py-4 px-2 gap-4 hover:bg-muted/20 transition-colors rounded-sm">
      {/* Left Details */}
      <div className="space-y-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-base font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors truncate">
            {interview.title}
          </h4>

          {interview.seniority_level && (
            <span className="inline-flex items-center text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded border border-border/80 bg-muted/50 text-muted-foreground">
              {interview.seniority_level}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5 font-medium text-foreground/80 truncate">
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" aria-hidden="true" />
            {interview.job_position}
          </span>
          <span className="text-border" aria-hidden="true">•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" aria-hidden="true" />
            Enrolled {formattedDate}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
        <Badge
          variant="outline"
          className={`flex items-center gap-1.5 font-normal text-xs px-2.5 py-1 rounded-md border ${config.badgeStyle}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${config.indicatorColor}`} aria-hidden="true" />
          {config.label}
        </Badge>

        {onActionClick && (
          <Button
            size="sm"
            variant={action.variant}
            disabled={isCancelled}
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
});

InterviewListItem.displayName = "InterviewListItem";

// --- Main Container Component ---
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

  // Single-pass Memo for Filtering and Counting
  const { filteredInterviews, counts } = useMemo(() => {
    let activeCount = 0;
    let completedCount = 0;

    const filtered = interviews.filter((interview) => {
      const isAct = interview.status === "not_started" || interview.status === "ongoing";
      const isComp = interview.status === "completed" || interview.status === "evaluated";

      if (isAct) activeCount++;
      if (isComp) completedCount++;

      // Tab filtering
      if (activeTab === "active" && !isAct) return false;
      if (activeTab === "completed" && !isComp) return false;

      // Search filtering
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      
      const titleMatch = interview.title?.toLowerCase().includes(query) ?? false;
      const posMatch = interview.job_position?.toLowerCase().includes(query) ?? false;
      const levelMatch = interview.seniority_level?.toLowerCase().includes(query) ?? false;

      return titleMatch || posMatch || levelMatch;
    });

    return {
      filteredInterviews: filtered,
      counts: {
        all: interviews.length,
        active: activeCount,
        completed: completedCount,
      },
    };
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
      <div className="w-full divide-y divide-border/60" aria-label="Loading interviews">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1 w-full">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex items-center gap-3 shrink-0">
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
      {/* Upper Filtering & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div 
          role="tablist"
          aria-label="Filter interviews by status"
          className="inline-flex items-center p-0.5 rounded-lg bg-muted/60 border border-border/50 text-xs font-medium text-muted-foreground"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "hover:text-foreground"
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "active"}
            onClick={() => setActiveTab("active")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "active"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "hover:text-foreground"
            }`}
          >
            Active ({counts.active})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "completed"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "hover:text-foreground"
            }`}
          >
            Completed ({counts.completed})
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

      {/* Filtered Content */}
      {filteredInterviews.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed rounded-lg text-muted-foreground">
          <p className="text-sm">No interviews match your selected filter or search query.</p>
        </div>
      ) : (
        <ul className="w-full divide-y divide-border/60 list-none p-0 m-0 border-t border-b border-border/60">
          {filteredInterviews.map((interview) => (
            <InterviewListItem
              key={interview.session_id}
              interview={interview}
              onActionClick={onActionClick}
            />
          ))}
        </ul>
      )}
    </div>
  );
};