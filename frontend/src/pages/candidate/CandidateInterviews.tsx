// CandidateInterviews.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "@/app/store";
import { getMyInterviews } from "@/features/candidate/candidateThunk";
import type { CandidateInterview } from "@/features/candidate/candidateTypes";
import { CandidateInterviewList } from "@/components/candidate/CandidateInterviewList";
import { useNavigate } from "react-router-dom";

export default function CandidateInterviews() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { interviews, loading, error } = useSelector(
    (state: RootState) => state.candidate
  );

  useEffect(() => {
    dispatch(getMyInterviews());
  }, [dispatch]);

  const handleActionClick = (interview: CandidateInterview) => {
    if (interview.status === "ongoing") {
      navigate(`/candidate/workspace/${interview.session_id}`);
    } else if (interview.status === "not_started") {
      navigate(`/candidate/interviews/${interview.session_id}/instructions`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Interviews</h1>
        <p className="text-muted-foreground">
          View, track, and jump into your scheduled assessment sessions.
        </p>
      </div>

      <CandidateInterviewList
        interviews={interviews}
        isLoading={loading}
        error={error}
        onActionClick={handleActionClick}
      />
    </div>
  );
}