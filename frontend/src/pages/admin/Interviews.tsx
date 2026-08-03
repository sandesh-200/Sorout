import { useAppDispatch } from "@/app/hooks";
import type { RootState } from "@/app/store";
import { InterviewTable } from "@/components/interview/InterviewTable"
import { columns } from "@/components/interview/TableColumn"
import { Error } from "@/components/shared/error";
import { ShimmerLoading } from "@/components/shared/shimmer-loading";
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
    <div className="py-3">
      <div className="header flex justify-between items-center">
    <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight">
      Interviews
    </h3>
  </div>

  {interviews.length === 0 && loading ? (
        <ShimmerLoading text="Loading Interviews..." />
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