// src/pages/candidate/components/InterviewerStatusHeader.tsx
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InterviewerAvatar } from "@/components/interviewConversation/InterviewerAvatar";

interface InterviewerStatusHeaderProps {
  sessionId: number;
  completed: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
}

export function InterviewerStatusHeader({
  sessionId,
  completed,
  isSpeaking,
  isThinking,
}: InterviewerStatusHeaderProps) {
  // Determine dynamic status text and color token for the active state
  const getStatusDetails = () => {
    if (completed) {
      return {
        label: "Session Completed",
        dotClass: "bg-muted-foreground",
        variant: "secondary" as const,
      };
    }
    if (isSpeaking) {
      return {
        label: "Speaking...",
        dotClass: "bg-emerald-500 animate-pulse",
        variant: "outline" as const,
      };
    }
    if (isThinking) {
      return {
        label: "Thinking...",
        dotClass: "bg-amber-500 animate-pulse",
        variant: "outline" as const,
      };
    }
    return {
      label: "Live Session",
      dotClass: "bg-emerald-500 animate-pulse",
      variant: "outline" as const,
    };
  };

  const status = getStatusDetails();

  return (
    <TooltipProvider>
      <header className="h-16 border-b border-border/60 px-4 sm:px-6 flex items-center justify-between bg-card/40 backdrop-blur-md shrink-0 z-10 select-none">
        {/* Left Section: Avatar & Identity Details */}
        <div className="flex items-center gap-3 min-w-0">
          <InterviewerAvatar
            size="sm"
            speaking={isSpeaking}
            thinking={isThinking}
          />
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight text-foreground truncate">
                Sabrina
              </h1>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={`Session ID ${sessionId}`}
                    className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
                  >
                    <Badge
                      variant="outline"
                      className="px-1.5 py-0 text-xs font-mono font-normal text-muted-foreground border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      #{sessionId}
                    </Badge>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Session ID: {sessionId}
                </TooltipContent>
              </Tooltip>
            </div>

            <p className="text-xs text-muted-foreground/80 truncate">
              Interviewer <span className="opacity-40 mx-0.5">•</span> Powered by Sorout AI
            </p>
          </div>
        </div>

        {/* Right Section: Dynamic Live Status */}
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant={status.variant}
            className="px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 border-border/80 transition-colors"
          >
            <span
              className={`h-2 w-2 rounded-full ${status.dotClass}`}
              aria-hidden="true"
            />
            {status.label}
          </Badge>
        </div>
      </header>
    </TooltipProvider>
  );
}