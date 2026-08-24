// InterviewInstructionsPage.tsx
import { useNavigate, useParams } from "react-router-dom";
import {  useSelector } from "react-redux";
import type {  RootState } from "@/app/store";
import InterviewInstructions from "@/components/interviewConversation/InterviewInstructions";

export default function InterviewInstructionsPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();

  const parsedSessionId = Number(sessionId);
  const interview = useSelector((state: RootState) =>
    state.interview.candidateInterviews.find((i) => i.session_id === parsedSessionId)
  );

  const handleCancel = () => {
    navigate("/candidate/interviews");
  };

  const handleConfirm = async () => {
    if (!parsedSessionId) return;
    navigate(`/candidate/workspace/${parsedSessionId}`);
  };

  const title = interview
    ? `${interview.seniority_level} ${interview.job_position}`
    : "AI Voice Interview Screening";
  const questionCount = interview?.max_questions ?? 5;
  const calculatedDuration = `${questionCount * 2}–${questionCount * 3} minutes`;

  return (
    <InterviewInstructions
      title={title}
      questionCount={questionCount}
      durationText={calculatedDuration}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    />
  );
}