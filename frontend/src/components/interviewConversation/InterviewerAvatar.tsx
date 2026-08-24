import { cn } from "@/lib/utils";

interface AlexAvatarProps {
  size?: "sm" | "md" | "lg";
  speaking?: boolean;
  thinking?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-16 w-16 text-2xl",
};

export function InterviewerAvatar({ size = "md", speaking, thinking, className }: AlexAvatarProps) {
  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center shrink-0 select-none font-bold",
        "bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-md",
        speaking && "ring-2 ring-violet-500 ring-offset-2 ring-offset-background",
        sizeMap[size],
        className
      )}
      aria-label="Alex, AI Interviewer"
    >
      {/* Subtle radial gradient overlay for depth */}
      <div className="absolute inset-0 rounded-full bg-white/10 mix-blend-overlay" />
      {/* Initials */}
      <span className="relative z-10 tracking-tight">A</span>

      {/* Speaking pulse ring */}
      {speaking && (
        <span className="absolute inset-0 rounded-full ring-2 ring-violet-400 animate-ping opacity-40" />
      )}

      {/* Thinking dots */}
      {thinking && !speaking && (
        <div className="absolute -bottom-1 -right-1 flex gap-0.5 bg-card border border-border rounded-full px-1 py-0.5 shadow-sm">
          <span className="h-1 w-1 rounded-full bg-violet-500 animate-bounce [animation-delay:0ms]" />
          <span className="h-1 w-1 rounded-full bg-violet-500 animate-bounce [animation-delay:150ms]" />
          <span className="h-1 w-1 rounded-full bg-violet-500 animate-bounce [animation-delay:300ms]" />
        </div>
      )}
    </div>
  );
}
