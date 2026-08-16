import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { getApiErrorMessage } from "@/utils/api-error";
import {
  Loader2,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Star,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuestionEvaluation {
  question: string;
  answer: string;
  score: number;
  feedback: string;
}

interface EvaluationResult {
  overall_score: number;
  overall_feedback: string;
  strengths: string[];
  improvements: string[];
  questions: QuestionEvaluation[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 8) return "text-emerald-500";
  if (score >= 5) return "text-amber-500";
  return "text-rose-500";
}

function scoreBg(score: number): string {
  if (score >= 8) return "bg-emerald-500/10 border-emerald-500/20";
  if (score >= 5) return "bg-amber-500/10 border-amber-500/20";
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

  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await api.get(`/candidate/sessions/${sessionId}/result`);
      setResult(res.data);
      setProcessing(false);
      setLoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Evaluation not ready yet — show processing screen and poll
        setProcessing(true);
        setLoading(false);
      } else {
        setError(
          getApiErrorMessage(error, "Failed to load results.")
        );
        setLoading(false);
      }
    }
  }, [sessionId]);

  // Initial fetch
  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  // Poll every 5 seconds while the AI is still evaluating
  useEffect(() => {
    if (!processing) return;
    const interval = setInterval(fetchResult, 5000);
    return () => clearInterval(interval);
  }, [processing, fetchResult]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your results…</p>
        </div>
      </div>
    );
  }

  // ── AI still processing ──
  if (processing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center max-w-sm space-y-6">
          <div className="relative mx-auto h-20 w-20">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Star className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Evaluating Your Interview</h2>
            <p className="text-sm text-muted-foreground">
              Our AI is carefully reviewing your responses. This usually takes less than a minute.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Checking automatically every 5 seconds…</span>
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
          <Button variant="outline" onClick={fetchResult}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const circumference = 2 * Math.PI * 40; // r=40
  const dashOffset = circumference - (result.overall_score / 10) * circumference;

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
          <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-8">
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
                    className={`transition-all duration-1000 ${scoreColor(result.overall_score)}`}
                    style={{ stroke: "currentColor" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-black ${scoreColor(result.overall_score)}`}>
                    {result.overall_score}
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
                    className={`${scoreBg(result.overall_score)} ${scoreColor(result.overall_score)} border font-semibold`}
                  >
                    {scoreLabel(result.overall_score)}
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">{result.overall_feedback}</p>
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
                {result.strengths.map((s, i) => (
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
                {result.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Per-question breakdown */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            Question Breakdown
          </h2>

          {result.questions.map((q, i) => (
            <Card key={i} className={`border ${scoreBg(q.score)}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Question {i + 1}
                  </span>
                  <Badge
                    variant="outline"
                    className={`shrink-0 font-bold ${scoreColor(q.score)} border ${scoreBg(q.score)}`}
                  >
                    {q.score}/10
                  </Badge>
                </div>
                <p className="text-sm font-medium leading-snug">{q.question}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md bg-muted/40 p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                    Your Answer
                  </p>
                  <p className="text-sm leading-relaxed">{q.answer}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                    Feedback
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80">{q.feedback}</p>
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
