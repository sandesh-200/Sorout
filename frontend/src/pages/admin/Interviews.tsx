import { useAppDispatch } from "@/app/hooks";
import type { RootState } from "@/app/store";
import { InterviewTable } from "@/components/interview/InterviewTable"
import { columns } from "@/components/interview/TableColumn"
import { Error } from "@/components/shared/error";
import { LoadingAnimation } from "@/components/shared/loading-animation";
import { getAllInterviews } from "@/features/interview/interviewThunk";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Interviews = () => {
const dispatch = useAppDispatch();

const { interviews, loading, error } = useSelector(
    (state:RootState) => state.interview
  );

useEffect(() => {
    dispatch(getAllInterviews());
  }, [dispatch]);



  return (
    <>
    <div>

  {interviews.length === 0 && loading ? (
        <LoadingAnimation text="Loading Interviews..." />
      ) : error ? (
        <Error message={error} onRetry={()=>dispatch(getAllInterviews())} />
      ) : (
        <InterviewTable columns={columns} data={interviews} />
      )}
    </div>
    </>
  )
}

export default Interviews