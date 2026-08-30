import { motion, useReducedMotion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { InterviewerAvatar } from "./InterviewerAvatar";

interface StreamingAiBubbleProps {
  /** The actively streaming text content from the AI interviewer */
  text: string;
}

export function StreamingAiBubble({ text }: StreamingAiBubbleProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex items-start gap-3 flex-row"
      role="region"
      aria-live="polite"
      aria-label="Sabrina is speaking"
    >
      {/* Active Interviewer Avatar */}
      <InterviewerAvatar size="sm" speaking />

      {/* Streaming Message Column */}
      <div className="flex flex-col items-start space-y-1.5 max-w-[85%] sm:max-w-[75%]">
        {/* Subtle Speaking Indicator Header */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium px-0.5 select-none">
          <Volume2 className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
          <span>Sabrina is speaking</span>
          <span className="relative flex h-1.5 w-1.5 ml-0.5">
            <span
              className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
              aria-hidden="true"
            />
            <span
              className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"
              aria-hidden="true"
            />
          </span>
        </div>

        {/* Active Streaming Speech Bubble */}
        <div className="px-4 py-2.5 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap bg-card text-card-foreground border border-primary/30 rounded-2xl rounded-tl-xs shadow-xs transition-colors">
          <span className="inline">{text}</span>
          <span
            className="inline-block w-1.5 h-3.5 ml-1 bg-primary/80 animate-pulse motion-reduce:animate-none align-baseline rounded-xs"
            aria-hidden="true"
          />
        </div>
      </div>
    </motion.div>
  );
}