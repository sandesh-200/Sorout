// InterviewInstructionsPage.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { startConversation } from "@/features/conversationInterview/conversationInterviewThunk";
import InterviewInstructions from "@/components/interviewConversation/InterviewInstructions";

export default function InterviewInstructionsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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

    try {
      // Trigger conversation start API
      await dispatch(startConversation(parsedSessionId)).unwrap();
      // Redirect to the conversational workspace
      navigate(`/candidate/workspace/${parsedSessionId}`);
    } catch (err) {
      console.error("Could not start conversation session:", err);
    }
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