import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "@/app/store";
import { getMyInterviews } from "@/features/interview/interviewThunk";
import type { CandidateInterview } from "@/features/interview/interviewTypes";
import { CandidateInterviewList } from "@/components/candidate/CandidateInterviewList";
import { useNavigate } from "react-router-dom";

export default function CandidateInterviews() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { candidateInterviews: interviews, loading, error } = useSelector(
    (state: RootState) => state.interview
  );

  useEffect(() => {
    dispatch(getMyInterviews());
  }, [dispatch]);

  const handleActionClick = (interview: CandidateInterview) => {
    if (interview.status === "ongoing") {
      navigate(`/candidate/workspace/${interview.session_id}`);
    } else if (interview.status === "not_started") {
      navigate(`/candidate/interviews/${interview.session_id}/instructions`);
    } else if (
      interview.status === "completed" ||
      interview.status === "evaluated"
    ) {
      navigate(`/candidate/results/${interview.session_id}`);
    }
  };

  return (
    <div className="w-full space-y-6">

      {/* Main Listing Component */}
      <CandidateInterviewList
        interviews={interviews}
        isLoading={loading}
        error={error}
        onActionClick={handleActionClick}
      />
    </div>
  );
}