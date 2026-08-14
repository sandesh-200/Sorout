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
import {
  Mic,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Clock,
  Sparkles,
  Radio,
  Loader2,
} from "lucide-react";

interface InterviewInstructionsProps {
  title: string;
  questionCount?: number;
  durationText: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function InterviewInstructions({
  title,
  questionCount,
  durationText,
  onCancel,
  onConfirm,
}: InterviewInstructionsProps) {
  const [micGranted, setMicGranted] = useState<boolean | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Clean up Web Audio resources
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

  // Request & Test Microphone
  const requestMicAccess = async () => {
    stopAudioTracks();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicGranted(true);
      setIsTesting(true);

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
      setIsTesting(false);
    }
  };

  useEffect(() => {
    return () => {
      stopAudioTracks();
    };
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

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="space-y-1.5 pb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>AI Voice Assessment</span>
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Verify your audio input and review the session rules before starting.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-sm">
          {/* Metadata Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 border rounded-md flex items-center gap-3 bg-muted/20">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium text-foreground">Estimated Duration</p>
                <p className="text-xs text-muted-foreground">
                  {durationText} {questionCount ? `• ${questionCount} Questions` : ""}
                </p>
              </div>
            </div>
            <div className="p-3.5 border rounded-md flex items-center gap-3 bg-muted/20">
              <Radio className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium text-foreground">Interaction Type</p>
                <p className="text-xs text-muted-foreground">Real-time spoken audio dialogue</p>
              </div>
            </div>
          </div>

          {/* Audio Setup Section */}
          <section className="border rounded-md p-4 space-y-3 bg-card" aria-label="Microphone setup">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-foreground" aria-hidden="true" />
                <h3 className="font-medium text-xs text-foreground">Microphone & Audio Input</h3>
              </div>
              {micGranted && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Connected
                </span>
              )}
            </div>

            {micGranted === null && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-xs text-muted-foreground">
                  Microphone access is required for real-time speech evaluation.
                </p>
                <Button size="sm" onClick={requestMicAccess} className="shrink-0 h-8 text-xs">
                  <Mic className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" /> Allow & Test Mic
                </Button>
              </div>
            )}

            {micGranted === false && (
              <Alert variant="destructive" className="py-2.5">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertTitle className="text-xs font-semibold">Microphone Access Blocked</AlertTitle>
                <AlertDescription className="text-xs">
                  Please grant microphone permissions in your browser address bar and try again.
                </AlertDescription>
              </Alert>
            )}

            {micGranted === true && isTesting && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Speak to test input level:</span>
                  <span className="font-mono text-xs">{audioLevel}%</span>
                </div>
                <Progress 
                  value={audioLevel} 
                  className="h-1.5" 
                  aria-label="Microphone input volume"
                  aria-valuenow={audioLevel}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            )}
          </section>

          {/* Instruction List */}
          <section className="space-y-2.5" aria-label="Session guidelines">
            <h3 className="font-medium text-xs text-foreground">Session Guidelines</h3>
            <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="select-none text-foreground/40">•</span>
                <span>
                  <strong className="text-foreground font-medium">Turn-taking dialogue:</strong> The AI interviewer speaks first. Listen to the entire prompt before responding.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="select-none text-foreground/40">•</span>
                <span>
                  <strong className="text-foreground font-medium">Automatic turn completion:</strong> Pausing for 1 to 2 seconds of continuous silence submits your answer.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="select-none text-foreground/40">•</span>
                <span>
                  <strong className="text-foreground font-medium">Quiet setting recommended:</strong> High background noise may prematurely trigger silence detection.
                </span>
              </li>
            </ul>
          </section>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/60 px-6 py-4 bg-muted/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isStarting}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleStart}
            disabled={!micGranted || isStarting}
            className="h-8 text-xs min-w-28"
          >
            {isStarting ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                Launching...
              </>
            ) : (
              "Start Interview"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}