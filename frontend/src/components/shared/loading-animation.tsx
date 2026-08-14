"use client";


interface ShimmerLoadingProps {
  /** Descriptive loading message describing the actual operation */
  text?: string;
  /** Optional class name to override or extend container styling */
  className?: string;
}

export function LoadingAnimation({ 
  text = "Loading...", 
  className 
}: ShimmerLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm p-4 transition-opacity duration-200 ${className ?? ""}`}
    >
      <div className="flex flex-col items-center max-w-xs w-full space-y-4 text-center">
        {/* Status Text */}
        <p className="text-xs font-medium text-muted-foreground tracking-wide select-none">
          {text}
        </p>

        {/* Minimal Indeterminate Linear Track */}
        <div className="relative h-0.5 w-32 sm:w-40 bg-muted/60 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 bottom-0 bg-primary/80 rounded-full w-1/3 animate-indeterminate-linear motion-reduce:animate-pulse motion-reduce:w-full motion-reduce:bg-primary/40"
          />
        </div>
      </div>
    </div>
  );
}