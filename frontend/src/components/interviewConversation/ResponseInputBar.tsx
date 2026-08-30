import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Mic, MicOff, Loader2, CheckCircle2, Send, Award, Sparkles } from "lucide-react";

interface EvaluationData {
  overall_score: number;
  overall_feedback: string;
}

interface ResponseInputBarProps {
  completed: boolean;
  isListening: boolean;
  isAiSpeaking: boolean;
  sendingMessage: boolean;
  loading: boolean;
  evaluating: boolean;
  evaluation: EvaluationData | null;
  onStartListening: () => void;
  onStopListening: () => void;
  onSubmitAnswer: (text: string) => void;
  onCompleteInterview: () => void;
}

export function ResponseInputBar({
  completed,
  isListening,
  isAiSpeaking,
  sendingMessage,
  loading,
  evaluating,
  evaluation,
  onStartListening,
  onStopListening,
  onSubmitAnswer,
  onCompleteInterview,
}: ResponseInputBarProps) {
  const [manualInput, setManualInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isBusy = isAiSpeaking || sendingMessage || loading;

  // Auto-grow textarea height dynamically up to a maximum height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 140);
    textarea.style.height = `${Math.max(newHeight, 40)}px`;
  }, [manualInput]);

  const handleSubmit = () => {
    if (manualInput.trim() && !isBusy) {
      onSubmitAnswer(manualInput.trim());
      setManualInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <TooltipProvider>
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-xl p-3 md:p-4 shrink-0 transition-colors">
        <div className="max-w-4xl mx-auto space-y-3">
          {!completed && (
            <div className="space-y-2">
              {/* Status indicator bar */}
              <AnimatePresence mode="wait">
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 px-1"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>Listening... Speak clearly</span>
                  </motion.div>
                )}

                {isAiSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    className="flex items-center gap-2 text-xs font-medium text-primary px-1"
                  >
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    <span>Sabrina is speaking...</span>
                  </motion.div>
                )}

                {sendingMessage && !isAiSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground px-1"
                  >
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    <span>Processing response...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main input container */}
              <div
                className={`relative flex items-end gap-2 p-1.5 rounded-2xl border transition-all ${
                  isBusy
                    ? "opacity-70 border-border/50 bg-muted/30 cursor-not-allowed"
                    : "border-input/80 bg-background hover:border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 shadow-xs"
                }`}
              >
                {/* Voice Input Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={isListening ? "destructive" : "ghost"}
                      size="icon"
                      className={`h-9 w-9 shrink-0 rounded-xl transition-all ${
                        isListening
                          ? "shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      onClick={isListening ? onStopListening : onStartListening}
                      disabled={isBusy}
                      aria-label={isListening ? "Stop recording voice" : "Start recording voice"}
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {isListening ? "Stop Voice Input" : "Answer with Voice"}
                  </TooltipContent>
                </Tooltip>

                {/* Auto-Growing Textarea */}
                <Textarea
                  ref={textareaRef}
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isAiSpeaking
                      ? "Sabrina is responding..."
                      : isListening
                      ? "Listening to voice input... (or type here)"
                      : "Type your structured response... (Press Enter to send)"
                  }
                  disabled={isBusy}
                  rows={1}
                  className="min-h-10 max-h-35 resize-none border-0 bg-transparent py-2 px-1 text-sm leading-relaxed shadow-none focus-visible:ring-0 focus-visible:outline-none placeholder:text-muted-foreground/60 transition-none"
                  aria-label="Your response input"
                />

                {/* Submit Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-xl shadow-2xs transition-all"
                      disabled={!manualInput.trim() || isBusy}
                      onClick={handleSubmit}
                      aria-label="Submit response"
                    >
                      {sendingMessage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs flex items-center gap-1">
                    <span>Submit</span>
                    <kbd className="pointer-events-none inline-flex h-4 select-none items-center rounded border border-border bg-muted px-1 text-[10px] font-mono font-medium text-muted-foreground">
                      ↵
                    </kbd>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}

          {/* Finalized Session & Evaluation Summary View */}
          {completed && (
            <div className="pt-1">
              {!evaluation ? (
                <Button
                  className="w-full py-5 rounded-xl font-medium text-sm shadow-2xs transition-all"
                  onClick={onCompleteInterview}
                  disabled={evaluating}
                >
                  {evaluating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Evaluating Performance Report...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      <span>Finalize Interview & View Evaluation</span>
                    </>
                  )}
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="p-4 bg-card border border-border/80 rounded-2xl space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-sm">Evaluation Report</h4>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs px-2.5 py-0.5">
                      Score: {evaluation.overall_score} / 100
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {evaluation.overall_feedback}
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </footer>
    </TooltipProvider>
  );
}