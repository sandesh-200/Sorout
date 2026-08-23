import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import InviteCandidateDialog from "@/components/candidate/InviteCandidateDialog";
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

  const [isInviteOpen, setIsInviteOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllCandidates());
  }, [dispatch]);

  return (
    <div className="space-y-6 p-2 w-full mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Organization Candidates</h2>
          <p className="text-sm text-muted-foreground">
            Manage candidates within your organization.
          </p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Candidates
        </Button>
      </div>

      <InviteCandidateDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} />

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