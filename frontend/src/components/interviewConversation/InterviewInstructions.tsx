import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Mic,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Clock,
  Sparkles,
  Radio,
  Loader2,
  VolumeX,
  Bot,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

interface InterviewInstructionsProps {
  title: string;
  questionCount?: number;
  durationText: string;
  isLoading?:boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}

const INSTRUCTION_STEPS = [
  {
    step: "01",
    title: "Virtual Interviewer",
    description: "You'll be speaking with Sabrina. Listen to the full question before answering.",
    icon: Bot,
  },
  {
    step: "02",
    title: "Natural Dialogue",
    description: "Speak clearly at a normal pace. A brief 1–2 second pause will auto-submit your response.",
    icon: MessageSquare,
  },
  {
    step: "03",
    title: "Quiet Environment",
    description: "Find a space with minimal background noise to prevent unexpected silence triggers.",
    icon: VolumeX,
  },
] as const;

export default function InterviewInstructions({
  title,
  questionCount,
  durationText,
  onCancel,
  onConfirm,
}: InterviewInstructionsProps) {
  const [micGranted, setMicGranted] = useState<boolean | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isReadyChecked, setIsReadyChecked] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Hardware Audio Cleanup
  const stopAudioTracks = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  // Hardware Audio Verification
  const requestMicAccess = async () => {
    stopAudioTracks();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicGranted(true);

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);

      analyser.fftSize = 64;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.error("Microphone access denied:", err);
      setMicGranted(false);
    }
  };

  useEffect(() => {
    return () => stopAudioTracks();
  }, []);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await onConfirm();
    } catch (err) {
      console.error("Failed to start session:", err);
      setIsStarting(false);
    }
  };

  const isStartDisabled = !micGranted || !isReadyChecked || isStarting;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden">
        {/* Header */}
        <CardHeader className="space-y-2 pb-6 border-b border-border/40 bg-muted/10">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>AI Voice Assessment</span>
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Complete the system check and review the guidelines before launching your session.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6 text-sm">
          {/* Metadata Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 border border-border/60 rounded-xl flex items-center gap-3 bg-card shadow-2xs">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <Clock className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Estimated Time</p>
                <p className="text-xs text-muted-foreground">
                  {durationText} {questionCount ? `• ${questionCount} Questions` : ""}
                </p>
              </div>
            </div>

            <div className="p-3.5 border border-border/60 rounded-xl flex items-center gap-3 bg-card shadow-2xs">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <Radio className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Interaction Type</p>
                <p className="text-xs text-muted-foreground">Real-time spoken dialogue</p>
              </div>
            </div>
          </div>

          {/* Interactive Hardware Setup Panel */}
          <section
            className="border border-border/80 rounded-xl p-4 space-y-3 bg-muted/20"
            aria-label="Hardware setup"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-foreground" aria-hidden="true" />
                <h3 className="font-semibold text-xs text-foreground">Hardware System Check</h3>
              </div>
              {micGranted && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Microphone Ready
                </span>
              )}
            </div>

            {micGranted === null && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-xs text-muted-foreground">
                  Microphone access is required for real-time speech evaluation.
                </p>
                <Button size="sm" onClick={requestMicAccess} className="shrink-0 h-8 text-xs rounded-lg">
                  <Mic className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" /> Check & Test Mic
                </Button>
              </div>
            )}

            {micGranted === false && (
              <Alert variant="destructive" className="py-2.5 rounded-lg">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertTitle className="text-xs font-semibold">Microphone Access Blocked</AlertTitle>
                <AlertDescription className="text-xs">
                  Please enable microphone access in your browser address bar and try again.
                </AlertDescription>
              </Alert>
            )}

            {micGranted === true && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Speak to test live input level:</span>
                  <span className="font-mono text-xs">{audioLevel}%</span>
                </div>
                <Progress value={audioLevel} className="h-1.5" aria-label="Microphone volume level" />
              </div>
            )}
          </section>

          {/* Structured Step Cards */}
          <section className="space-y-3" aria-label="Session guidelines">
            <h3 className="font-semibold text-xs text-foreground">Before You Begin</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {INSTRUCTION_STEPS.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.step}
                    className="p-3.5 border border-border/60 rounded-xl bg-card space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-muted-foreground/60">
                        {step.step}
                      </span>
                      <IconComponent className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <h4 className="font-medium text-xs text-foreground">{step.title}</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Readiness Acknowledgment */}
          <div className="flex items-center space-x-2 pt-2 border-t border-border/40">
            <Checkbox
              id="readiness-check"
              checked={isReadyChecked}
              onCheckedChange={(checked) => setIsReadyChecked(!!checked)}
            />
            <Label htmlFor="readiness-check" className="text-xs text-muted-foreground cursor-pointer select-none">
              I am in a quiet environment and ready to begin the voice assessment.
            </Label>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex items-center justify-between border-t border-border/60 px-6 py-4 bg-muted/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isStarting}
            className="h-9 text-xs rounded-lg"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleStart}
            disabled={isStartDisabled}
            className="h-9 text-xs min-w-32 rounded-lg"
          >
            {isStarting ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                Launching...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Start Session
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}