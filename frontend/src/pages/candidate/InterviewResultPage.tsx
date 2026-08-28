import { useEffect,useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useAppDispatch,useAppSelector } from '@/app/hooks'
import { clearEvaluation } from "@/features/evaluation/evaluationSlice";

import { getEvaluationResult } from '@/features/evaluation/evaluationThunk'

import {
  Loader2,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";



// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 9) return "text-emerald-500";
  if (score >= 7) return "text-amber-500";
  return "text-rose-500";
}

function scoreBg(score: number): string {
  if (score >= 9) return "bg-emerald-500/10 border-emerald-500/20";
  if (score >= 7) return "bg-amber-500/10 border-amber-500/20";
  return "bg-rose-500/10 border-rose-500/20";
}

function scoreLabel(score: number): string {
  if (score >= 9) return "Excellent";
  if (score >= 7) return "Good";
  if (score >= 5) return "Satisfactory";
  return "Needs Improvement";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function InterviewResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

const dispatch = useAppDispatch();

const { evaluation, status, error } = useAppSelector(
  (state) => state.evaluation
);

const [retryKey, setRetryKey] = useState(0);



useEffect(() => {
  if (!sessionId) return;

  dispatch(clearEvaluation());

  let cancelled = false;
  let timeoutId: ReturnType<typeof setTimeout>;

  const poll = async () => {
    const resultAction = await dispatch(
      getEvaluationResult(Number(sessionId))
    );

    if (cancelled) return;

    if (getEvaluationResult.fulfilled.match(resultAction)) {
      const result = resultAction.payload;

      if ("status" in result && result.status === "evaluating") {
        timeoutId = setTimeout(poll, 2000);
      }
    }
  };

  poll();

  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
  };
}, [dispatch, sessionId, retryKey]);



if (status === "loading" || status === "evaluating") {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex max-w-md flex-col items-center gap-4 px-6 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />

        <div className="space-y-2">
          <h1 className="text-lg font-semibold">
            Your evaluation is being prepared
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Your interview has been completed successfully. We're analyzing
            your answers and preparing your evaluation report.
          </p>

          <p className="text-xs text-muted-foreground">
            This page will update automatically when your results are ready.
          </p>
        </div>
      </div>
    </div>
  );
}

  // ── Error ──
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center max-w-sm space-y-4">
          <p className="text-destructive font-medium">{error}</p>
      <Button
  variant="outline"
  onClick={() => setRetryKey((value) => value + 1)}
>
  <RefreshCw className="mr-2 h-4 w-4" />
  Try Again
</Button>
        </div>
      </div>
    );
  }

  if (!evaluation) return null;

  const circumference = 2 * Math.PI * 40; // r=40
  const dashOffset = circumference - (evaluation.overall_score / 10) * circumference;

  // ── Results ──
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm px-6 h-14 flex items-center">
        <div className="mx-auto w-full max-w-4xl flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/candidate/interviews")}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            My Interviews
          </Button>
          <span className="text-sm font-semibold text-muted-foreground">Interview Results</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">

        {/* Score Hero Card */}
        <Card className="overflow-hidden">
          <div className="bg-linear-to-br from-primary/5 via-primary/10 to-transparent p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">

              {/* Circular score gauge */}
              <div className="relative shrink-0">
                <svg className="h-36 w-36 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    strokeWidth="8"
                    className="stroke-muted/20"
                  />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className={`transition-all duration-1000 ${scoreColor(evaluation.overall_score)}`}
                    style={{ stroke: "currentColor" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-black ${scoreColor(evaluation.overall_score)}`}>
                    {evaluation.overall_score}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">/ 10</span>
                </div>
              </div>

              {/* Summary */}
              <div className="text-center sm:text-left space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <h1 className="text-2xl font-bold tracking-tight">Interview Complete</h1>
                  <Badge
                    variant="outline"
                    className={`${scoreBg(evaluation.overall_score)} ${scoreColor(evaluation.overall_score)} border font-semibold`}
                  >
                    {scoreLabel(evaluation.overall_score)}
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">{evaluation.overall_feedback}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Strengths & Improvements */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <TrendingDown className="h-4 w-4" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {evaluation.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

{/* Segment Breakdown */}
<div className="space-y-4">
  <h2 className="text-lg font-semibold flex items-center gap-2">
    <MessageSquare className="h-5 w-5 text-muted-foreground" />
    Interview Breakdown
  </h2>

  {evaluation.segments.map((segment, i) => (
    <Card
      key={i}
      className={`border ${scoreBg(segment.evaluation.score)}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Discussion {i + 1}
          </span>

          <Badge
            variant="outline"
            className={`shrink-0 font-bold ${scoreColor(
              segment.evaluation.score
            )} border ${scoreBg(segment.evaluation.score)}`}
          >
            {segment.evaluation.score}/10
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted/40 p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
            Discussion
          </p>

          <p className="text-sm leading-relaxed whitespace-pre-line">
            {segment.discussion}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
            Feedback
          </p>

          <p className="text-sm leading-relaxed text-foreground/80">
            {segment.evaluation.feedback}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Strengths
          </p>

          <ul className="space-y-1">
            {segment.evaluation.strengths.map((strength, index) => (
              <li key={index} className="text-sm">
                • {strength}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Weaknesses
          </p>

          <ul className="space-y-1">
            {segment.evaluation.weaknesses.map((weakness, index) => (
              <li key={index} className="text-sm">
                • {weakness}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

        {/* CTA */}
        <div className="flex justify-center pb-4">
          <Button onClick={() => navigate("/candidate/interviews")} size="lg">
            Back to My Interviews
          </Button>
        </div>
      </main>
    </div>
  );
}
