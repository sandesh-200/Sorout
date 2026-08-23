import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { assignCandidates } from '@/features/interview/interviewThunk';
import { getAvailableCandidates } from '@/features/candidate/candidateThunk';
import { clearAvailableCandidates } from "@/features/candidate/candidateSlice";
import type { Interview } from "@/features/interview/interviewTypes";
import { toast } from "sonner";
import { Search, UserPlus, Users, Loader2, Mail } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AssignCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: Interview | null;
}

export default function AssignCandidateDialog({
  open,
  onOpenChange,
  interview,
}: AssignCandidateDialogProps) {
  const dispatch = useAppDispatch();
  
  const availableCandidates = useAppSelector((state) => state.candidate.availableCandidates) || [];
  const isGlobalLoading = useAppSelector((state) => state.interview.loading || state.candidate.loading);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (open && interview?.id) {
      dispatch(getAvailableCandidates(interview.id));
      setSelectedIds([]);
      setSearchQuery("");
    }

    return () => {
      if (!open) {
        dispatch(clearAvailableCandidates());
      }
    };
  }, [open, interview?.id, dispatch]);

  const filteredCandidates = availableCandidates.filter((candidate) => {
    const searchTarget = searchQuery.toLowerCase();
    return (
      candidate.name.toLowerCase().includes(searchTarget) ||
      candidate.email.toLowerCase().includes(searchTarget)
    );
  });

  const handleToggleRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    const filteredIds = filteredCandidates.map((c) => c.id);
    const allFilteredAreSelected = filteredIds.every((id) => selectedIds.includes(id));

    if (allFilteredAreSelected) {
      // Deselect only the currently filtered subset
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      // Union merge current selection with the filtered subset to preserve multi-page integrity
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleConfirmAssignment = async () => {
    if (!interview?.id || selectedIds.length === 0) return;

    const result = await dispatch(
      assignCandidates({
        interviewId: interview.id,
        data: { candidate_ids: selectedIds },
      })
    );

    if (assignCandidates.fulfilled.match(result)) {
      toast.success(result.payload.message || `Successfully assigned ${result.payload.assigned_count} candidates.`);
      onOpenChange(false);
    } else {
      toast.error((result.payload as string) ?? "Failed to assign candidates.");
    }
  };

  // Determine indeterminate state for search-aware selection handling
  const filteredIds = filteredCandidates.map((c) => c.id);
  const selectedFilteredCount = filteredIds.filter((id) => selectedIds.includes(id)).length;
  const isAllFilteredSelected = filteredCandidates.length > 0 && selectedFilteredCount === filteredCandidates.length;
  const isSomeFilteredSelected = selectedFilteredCount > 0 && selectedFilteredCount < filteredCandidates.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-120 overflow-hidden flex flex-col max-h-[85vh] p-6">
        
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <UserPlus className="h-5 w-5 text-primary" />
            Assign Candidates
          </DialogTitle>
          <DialogDescription className="truncate">
            Assign qualified candidates to active workspace session:{" "}
            <span className="font-semibold text-foreground">
              {interview?.title || "Session"}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="relative my-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/40 focus-visible:ring-1"
          />
        </div>

        {filteredCandidates.length > 0 && (
          <div className="flex items-center justify-between border-b pb-2 px-2 text-xs text-muted-foreground font-medium bg-muted/20 py-1.5 rounded-t-md">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={isAllFilteredSelected ? true : isSomeFilteredSelected ? "indeterminate" : false}
                onCheckedChange={handleToggleAll}
                aria-label="Select all filtered items"
              />
              <span className="cursor-pointer select-none" onClick={handleToggleAll}>
                Select All Filtered
              </span>
            </div>
            <Badge variant="secondary" className="font-mono text-[11px] px-1.5 py-0">
              {selectedFilteredCount}/{filteredCandidates.length} Found
            </Badge>
          </div>
        )}

        <div className="flex-1 min-h-60 relative mt-1 rounded-b-md border border-t-0 border-input bg-background/50">
          {isGlobalLoading && availableCandidates.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm">Loading workspace metrics...</p>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground text-center p-4">
              <Users className="h-8 w-8 text-muted-foreground/40 mb-2 stroke-[1.5]" />
              <p className="text-sm font-medium">No candidates found</p>
              <p className="text-xs text-muted-foreground max-w-65 mt-0.5">
                {searchQuery 
                  ? "Try adjusting your search criteria parameters." 
                  : "All current talent records are assigned to this pipeline track."
                }
              </p>
            </div>
          ) : (
            <ScrollArea className="h-70 w-full p-1.5">
              <div className="space-y-1">
                {filteredCandidates.map((candidate) => {
                  const isChecked = selectedIds.includes(candidate.id);
                  const cleanName = !candidate.name || candidate.name === "string" 
                    ? "Unnamed Candidate" 
                    : candidate.name;

                  return (
                    <div
                      key={candidate.id}
                      onClick={() => handleToggleRow(candidate.id)}
                      className={`flex items-start gap-3 rounded-md p-2.5 transition-colors cursor-pointer select-none border ${
                        isChecked
                          ? "bg-accent/70 border-accent/60 text-accent-foreground"
                          : "hover:bg-muted/60 border-transparent"
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleToggleRow(candidate.id)}
                        onClick={(e) => e.stopPropagation()} 
                        className="mt-0.5 pointer-events-none" // Kept functional via parent element context selection layout mechanics
                      />
                      <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                        <span className="text-sm font-medium leading-none text-foreground">
                          {cleanName}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                          <Mail className="h-3 w-3 inline shrink-0 opacity-70" />
                          {candidate.email}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="pt-4 border-t mt-4 flex items-center justify-between sm:justify-between w-full">
          <div className="text-xs text-muted-foreground hidden sm:block font-medium">
            Total Selected: <span className="text-foreground font-semibold font-mono bg-muted px-1.5 py-0.5 rounded">{selectedIds.length}</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isGlobalLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmAssignment}
              disabled={selectedIds.length === 0 || isGlobalLoading}
              className="min-w-25"
            >
              {isGlobalLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                `Assign Selected`
              )}
            </Button>
          </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}