// InterviewInstructions.tsx
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
} from "lucide-react";

interface InterviewInstructionsProps {
  title: string;
  questionCount: number;
  durationText: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function InterviewInstructions({
  title,
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

  // Request & Test Microphone
  const requestMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicGranted(true);
      setIsTesting(true);

      // Set up Audio Analyser for mic level testing
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);

      analyser.fftSize = 64;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
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

  // Cleanup Web Audio API streams when leaving the page
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const handleStart = async () => {
    setIsStarting(true);
    await onConfirm();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
            <Sparkles className="h-4 w-4" /> Conversational AI Assessment
          </div>
          <CardTitle className="text-2xl mt-1">{title}</CardTitle>
          <CardDescription>
            Read the instructions below and verify your audio setup before launching the session.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Format Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg flex items-start gap-3 bg-muted/30">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Estimated Duration</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{durationText}</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg flex items-start gap-3 bg-muted/30">
              <Radio className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Interaction Type</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time spoken dialogue with an AI interviewer
                </p>
              </div>
            </div>
          </div>

          {/* Voice Interview Instructions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-md">How the Voice Session Works</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside leading-relaxed">
              <li>
                <strong className="text-foreground">AI Speaks First:</strong> The AI will ask a question or introduce a context out loud.
              </li>
              <li>
                <strong className="text-foreground">Automatic Silence Detection:</strong> Once you stop speaking for 1 to 2 seconds, your response is automatically submitted.
              </li>
              <li>
                <strong className="text-foreground">Natural Flow:</strong> Speak naturally as you would in a real interview. You can pause briefly to collect your thoughts.
              </li>
              <li>
                <strong className="text-foreground">Quiet Environment:</strong> Ensure you are in a quiet room to prevent background noise from triggering auto-submit.
              </li>
            </ul>
          </div>

          {/* Microphone Verification & Test Box */}
          <div className="border rounded-lg p-5 space-y-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-sm">Microphone & Audio Setup</h3>
              </div>
              {micGranted && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Ready
                </span>
              )}
            </div>

            {micGranted === null && (
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  You need to grant microphone access to participate in this interview.
                </p>
                <Button size="sm" onClick={requestMicAccess} className="shrink-0">
                  <Mic className="h-4 w-4 mr-2" /> Allow & Test Mic
                </Button>
              </div>
            )}

            {micGranted === false && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Microphone Access Denied</AlertTitle>
                <AlertDescription className="text-xs">
                  Please enable microphone access in your browser settings and refresh this page to proceed.
                </AlertDescription>
              </Alert>
            )}

            {micGranted === true && isTesting && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Speak to test input volume:</span>
                  <span>{audioLevel}%</span>
                </div>
                <Progress value={audioLevel} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isStarting}>
            Cancel
          </Button>
          <Button
            onClick={handleStart}
            disabled={!micGranted || isStarting}
          >
            {isStarting ? "Starting Session..." : "I'm Ready, Start Interview"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}