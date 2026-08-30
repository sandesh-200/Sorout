import { motion, useReducedMotion } from "framer-motion";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InterviewerAvatar } from "./InterviewerAvatar";

interface ConversationBubbleProps {
  role: "candidate" | "interviewer";
  content: string;
}

export function ConversationBubble({ role, content }: ConversationBubbleProps) {
  const isUser = role === "candidate";
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      role="article"
      aria-label={`Message from ${isUser ? "You" : "Sabrina"}`}
    >
      {/* Avatar Section */}
      {isUser ? (
        <Avatar className="h-8 w-8 text-xs border border-primary/20 shrink-0 shadow-xs">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-4 w-4" aria-hidden="true" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <InterviewerAvatar size="sm" />
      )}

      {/* Message Content Section */}
      <div
        className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap transition-colors ${
            isUser
              ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-xs shadow-xs"
              : "bg-muted/60 text-foreground border border-border/60 rounded-2xl rounded-tl-xs shadow-xs"
          }`}
        >
          {content}
        </div>
      </div>
    </motion.div>
  );
}