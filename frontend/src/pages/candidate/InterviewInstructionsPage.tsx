import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import InterviewInstructions from "@/components/interviewConversation/InterviewInstructions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function InterviewInstructionsPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [isInitializing, setIsInitializing] = useState(false);

  // 1. Safely parse & validate sessionId
  const parsedSessionId = useMemo(() => {
    const id = Number(sessionId);
    return isNaN(id) ? null : id;
  }, [sessionId]);

  // 2. Select interview from Redux state
  const interview = useSelector((state: RootState) =>
    parsedSessionId !== null
      ? state.interview.candidateInterviews.find((i) => i.session_id === parsedSessionId)
      : undefined
  );

  const handleCancel = () => {
    navigate("/candidate/interviews");
  };

  const handleConfirm = async () => {
    if (!parsedSessionId) return;

    try {
      setIsInitializing(true);
      
      // OPTIONAL: If you need to hit an API endpoint to mark the session as "STARTED"
      // or request WebRTC / LiveKit tokens before landing on the workspace, do it here:
      // await dispatch(startInterviewSession(parsedSessionId)).unwrap();

      navigate(`/candidate/workspace/${parsedSessionId}`);
    } catch (error) {
      console.error("Failed to start interview session:", error);
      setIsInitializing(false);
    }
  };

  // 3. Handle Invalid Session ID or missing interview record
  if (!parsedSessionId) {
    return (
      <div className="max-w-md mx-auto my-12 p-4">
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Invalid Session</h3>
              <p className="text-xs text-muted-foreground">
                The interview session ID provided is missing or invalid.
              </p>
            </div>
            <Button size="sm" onClick={handleCancel}>
              Back to Interviews
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 4. Derive instructions display data
  const title = interview
    ? `${interview.seniority_level} ${interview.job_position}`.trim()
    : "AI Voice Interview Screening";
    
  const questionCount = interview?.max_questions ?? 5;
  
  // Rule of thumb for voice interview duration: ~2-3 mins per question
  const calculatedDuration = `${questionCount * 2}–${questionCount * 3} minutes`;

  return (
    <InterviewInstructions
      title={title}
      questionCount={questionCount}
      durationText={calculatedDuration}
      isLoading={isInitializing}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    />
  );
}