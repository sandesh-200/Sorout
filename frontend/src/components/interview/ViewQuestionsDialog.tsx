import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/app/hooks";
import { Loader2, HelpCircle } from "lucide-react";
import type { Interview } from "@/features/interview/interviewTypes";

interface ViewQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: Interview | null;
}

export default function ViewQuestionsDialog({
  open,
  onOpenChange,
  interview,
}: ViewQuestionsDialogProps) {
  const { questions, loading } = useAppSelector((state) => state.question);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Generated Questions
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Reviewing generated questions for{" "}
            <span className="font-semibold text-foreground">
              {interview?.title || "this session"}
            </span>{" "}
            ({interview?.job_position} — {interview?.seniority_level})
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 py-4">
          {loading ? (
            <div className="h-40 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Fetching interview questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-muted-foreground border border-dashed rounded-lg">
              <p className="text-sm font-medium">No questions found for this session.</p>
            </div>
          ) : (
            <ScrollArea className="h-[50vh] pr-4">
              <div className="space-y-4">
                {questions
                  .slice()
                  .sort((a, b) => a.order_sequence - b.order_sequence)
                  .map((q) => (
                    <div
                      key={q.id}
                      className="flex gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent/50 transition-colors duration-150"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-mono font-bold text-primary">
                        {q.order_sequence}
                      </div>
                      <div className="pt-0.5 text-sm font-medium leading-relaxed text-foreground select-text">
                        {q.question_text}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}