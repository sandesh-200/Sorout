import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getAllCandidates } from "@/features/candidate/candidateThunk";
import { CandidateTable } from "@/components/candidate/AdminCandidatesTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Candidates() {
  const dispatch = useAppDispatch();
  const { candidates, loading, error } = useAppSelector(
    (state) => state.candidate
  );

  useEffect(() => {
    dispatch(getAllCandidates());
  }, [dispatch]);

  return (
    <div className="space-y-6 p-2">

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="space-y-1">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <CandidateTable candidates={candidates} />
      )}
    </div>
  );
}