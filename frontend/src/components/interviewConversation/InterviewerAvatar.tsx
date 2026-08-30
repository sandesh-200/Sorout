import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface InterviewerAvatarProps {
  /** Optional image URL for the interviewer avatar */
  src?: string;
  /** Accessible alt text for the avatar image */
  alt?: string;
  /** Fallback initials or text when image is absent or loading */
  fallback?: string;
  /** Size variant of the avatar */
  size?: "sm" | "md" | "lg";
  /** Indicates whether the AI interviewer is actively speaking */
  speaking?: boolean;
  /** Indicates whether the AI interviewer is processing/thinking */
  thinking?: boolean;
  /** Additional custom CSS classes */
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

export function InterviewerAvatar({
  src,
  alt = "Sabrina, AI Interviewer",
  fallback = "S",
  size = "md",
  speaking = false,
  thinking = false,
  className,
}: InterviewerAvatarProps) {
  return (
    <div className="relative inline-flex shrink-0 select-none">
      <Avatar
        className={cn(
          "transition-all duration-300 ring-offset-background",
          sizeMap[size],
          speaking && "ring-2 ring-primary ring-offset-2 animate-pulse",
          className
        )}
        aria-label={alt}
      >
        {src && <AvatarImage src={src} alt={alt} className="object-cover" />}
        <AvatarFallback className="bg-primary/10 text-primary font-medium tracking-tight border border-primary/20">
          {fallback}
        </AvatarFallback>
      </Avatar>

      {/* Thinking State Indicator */}
      {thinking && !speaking && (
        <div
          className="absolute -bottom-1 -right-1 flex gap-0.5 bg-card border border-border rounded-full px-1.5 py-1 shadow-sm z-10"
          aria-hidden="true"
        >
         <span className="dot-bounce [animation-delay:0ms]" />
<span className="dot-bounce [animation-delay:150ms]" />
<span className="dot-bounce [animation-delay:300ms]" />
        </div>
      )}
    </div>
  );
}