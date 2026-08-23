import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useAuth } from "@/hooks/useAuth";
import {
  getJoinLinks,
  createJoinLink,
  deactivateJoinLink,
} from "@/features/joinLink/joinLinkThunk";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Link as LinkIcon, Trash, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface InviteCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InviteCandidateDialog({
  open,
  onOpenChange,
}: InviteCandidateDialogProps) {
  const dispatch = useAppDispatch();
  const { joinLinks, loading } = useAppSelector((state) => state.adminJoinLink);

  const { user, activeOrg } = useAuth();
  const orgId = activeOrg?.organization_id ?? user?.memberships?.[0]?.organization_id;

  useEffect(() => {
    if (open && orgId) {
      dispatch(getJoinLinks(orgId));
    }
  }, [open, orgId, dispatch]);

  const handleCopy = (token: string) => {
    const joinUrl = `${window.location.origin}/join/${token}`;
    navigator.clipboard.writeText(joinUrl);
    toast.success("Join link copied to clipboard!");
  };

  const handleGenerateLink = async () => {
    if (!orgId) {
      toast.error("Organization ID not found");
      return;
    }

    try {
      await dispatch(
        createJoinLink({
          orgId,
          expires_at: undefined,
        })
      ).unwrap();

      toast.success("Join link created successfully");
    } catch (error: any) {
      toast.error(error || "Failed to generate link");
    }
  };

  const handleDelete = async (linkId: number) => {
    if (!orgId) return;
    const result = await dispatch(deactivateJoinLink({ orgId, linkId }));
    if (deactivateJoinLink.fulfilled.match(result)) {
      toast.success("Join link deactivated.");
    } else {
      toast.error("Failed to deactivate join link.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full max-w-[95vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Invite Candidates
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 w-full min-w-0">
          <p className="text-sm text-muted-foreground">
            Generate and share links with candidates so they can join your
            organization's interview platform.
          </p>

          <Button
            type="button"
            onClick={handleGenerateLink}
            disabled={!orgId || loading}
            className="w-full flex items-center justify-center gap-2"
          >
            <LinkIcon className="h-4 w-4" />
            {loading ? "Generating..." : "Generate New Link"}
          </Button>

          {/* Native scroll container replacing Radix ScrollArea */}
          <div className="h-64 w-full rounded-md border p-2 overflow-y-auto overflow-x-hidden">
            {joinLinks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No active links found.
              </div>
            ) : (
              <ul className="space-y-2 p-0 m-0 list-none w-full">
                {joinLinks.map((link) => (
                  <li
                    key={link.id}
                    className="flex items-center justify-between p-3 border rounded-md gap-2 w-full min-w-0"
                  >
                    {/* Explicit break-all guarantees text forces layout wrap/truncation inside flex */}
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="truncate text-xs font-mono text-muted-foreground block w-full">
                        {link.token
                          ? `${window.location.origin}/join/${link.token}`
                          : `Link ID #${link.id}`}
                      </p>
                    </div>

                    {/* Action buttons fixed width */}
                    <div className="flex gap-1.5 shrink-0">
                      <Button
                        size="icon"
                        variant="outline"
                        type="button"
                        onClick={() => link.token && handleCopy(link.token)}
                        disabled={!link.token}
                        className="h-8 w-8"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        type="button"
                        onClick={() => handleDelete(link.id)}
                        className="h-8 w-8"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}