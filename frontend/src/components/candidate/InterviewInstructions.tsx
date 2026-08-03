import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Clock, RotateCcw, ShieldCheck, HelpCircle } from "lucide-react";

interface InterviewInstructionsProps {
  title?: string;
  questionCount?: number; // Made dynamic
  durationText?: string;  // Made dynamic (e.g., "20–25 minutes")
  onCancel: () => void;
  onConfirm: () => void;
}

export default function InterviewInstructions({
  title = "Senior Backend Developer",
  questionCount = 10, // Default fallback
  durationText = "20–25 minutes", // Default fallback
  onCancel,
  onConfirm,
}: InterviewInstructionsProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-4 min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-lg shadow-md border-muted">
        <CardHeader className="text-center pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Interview Assessment
          </span>
          <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
          <CardDescription>Review the guidelines below before starting your session.</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-5 pt-6">
          <h3 className="font-semibold text-foreground text-sm tracking-wide uppercase">
            Before you begin
          </h3>
          
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-sm text-secondary-foreground font-medium">
                You will answer {questionCount} questions.
              </span>
            </li>
            
            <li className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-sm text-secondary-foreground font-medium">
                Answer each question honestly.
              </span>
            </li>
            
            <li className="flex items-start gap-3">
              <RotateCcw className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <span className="text-sm text-secondary-foreground font-medium">
                You cannot go back once a question is submitted.
              </span>
            </li>
            
            <li className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-sm text-secondary-foreground font-medium">
                Your answers are evaluated by AI.
              </span>
            </li>
            
            <li className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-sm text-secondary-foreground font-medium">
                Estimated duration: {durationText}.
              </span>
            </li>
          </ul>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-4 pt-4 border-t">
          <Button variant="ghost" onClick={onCancel} className="px-6">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="px-6 font-semibold">
            I'm Ready
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}