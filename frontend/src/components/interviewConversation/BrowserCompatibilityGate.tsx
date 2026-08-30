import { AlertCircle } from "lucide-react";

export function BrowserCompatibilityGate() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Speech Recognition Unsupported</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Your browser does not support Web Speech APIs. Please switch to Google Chrome or Microsoft Edge to continue your session.
      </p>
    </div>
  );
}