import { CheckCircle2, Circle, Loader2, Sparkles, UserPlus, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Interview } from "@/features/interview/interviewTypes";

interface Props {
  interview: Interview;
  isGenerating: boolean;
  justGenerated: boolean; // NEW: true briefly after generation completes, before data refresh
  onGenerate: () => void;
  onAssign: () => void;
}

const steps = [
  { key: "create",    label: "Session Created",     desc: "Interview template configured" },
  { key: "questions", label: "Questions Generated", desc: "AI question bank ready" },
  { key: "assign",    label: "Candidates Assigned", desc: "Candidates enrolled" },
];

export function InterviewSetupChecklist({
  interview,
  isGenerating,
  justGenerated,
  onGenerate,
  onAssign,
}: Props) {
  // Consider questions done if either the backend says so OR we just triggered generation
  const hasQuestions = interview.has_questions || justGenerated;
  const hasAssigned  =
    interview.status === "ready"     ||
    interview.status === "ongoing"   ||
    interview.status === "completed";

  const stepState = [true, hasQuestions, hasAssigned];
  const allDone   = stepState.every(Boolean);

  return (
    <div
      className="px-4 py-4 bg-muted/30 border-t border-border/40 space-y-4"
      onClick={(e) => e.stopPropagation()} // Prevent row toggle when clicking inside
    >
      {/* ── Step track ── */}
      <div className="flex items-start gap-0">
        {steps.map((step, i) => {
          const done    = stepState[i];
          const active  = !done && (i === 0 || stepState[i - 1]);
          const loading = isGenerating && i === 1;

          return (
            <div key={step.key} className="flex items-center flex-1">
              {/* Connector line before each step (except first) */}
              {i > 0 && (
                <div
                  className={`h-px flex-1 transition-colors duration-500 ${
                    stepState[i - 1] ? "bg-primary/40" : "bg-border/40"
                  }`}
                />
              )}

              {/* Step node */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                {/* Circle / Check / Spinner */}
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : loading
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : active
                      ? "border-border bg-background text-muted-foreground"
                      : "border-border/40 bg-background text-border"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] font-medium text-center leading-tight whitespace-nowrap transition-colors duration-300 ${
                    done
                      ? "text-foreground"
                      : active
                      ? "text-muted-foreground"
                      : "text-border"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Action / status ── */}
      <div className="flex items-center justify-between">
        {/* Left hint */}
        <p className="text-xs text-muted-foreground">
          {isGenerating
            ? "AI is generating your interview questions…"
            : justGenerated && !interview.has_questions
            ? "Questions ready! Now assign candidates to launch."
            : hasQuestions && !hasAssigned
            ? "Questions ready — assign candidates to make this interview live."
            : allDone
            ? "All steps complete. Interview is live."
            : "Generate AI-powered questions to proceed."}
        </p>

        {/* Right action */}
        {allDone ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
            <Rocket className="h-3.5 w-3.5" />
            Live
          </div>
        ) : !hasQuestions ? (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1.5 shrink-0"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="h-3 w-3" /> Generate with AI</>
            )}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="default"
            className="h-7 text-xs gap-1.5 shrink-0"
            onClick={onAssign}
          >
            <UserPlus className="h-3 w-3" /> Assign Candidates
          </Button>
        )}
      </div>
    </div>
  );
}
