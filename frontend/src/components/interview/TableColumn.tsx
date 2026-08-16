import { type ColumnDef } from "@tanstack/react-table";
import type { Interview } from "@/features/interview/interviewTypes";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, Eye, Sparkles, FileQuestion, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";
import { DataTableColumnHeader } from "../shared/data-table-column-header";
import { format } from "date-fns";

const statusClasses = {
  draft: "status-draft",
  ready: "status-ready",
  ongoing: "status-ongoing",
  completed: "status-completed",
  cancelled: "",
};

interface InterviewTableMeta {
  generatingId?: number
  onEditRow?: (interview: Interview) => void
  onGenerateQuestions?: (interview: Interview) => void
  onViewQuestions?: (interview: Interview) => void
  onAssignInterview?: (interview: Interview) => void
  onDeleteRow: (interview: Interview) => void
}

export const columns: ColumnDef<Interview>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "title",
    // Clean, reusable sorting abstraction
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    size: 250,
    cell: ({ row }) => <div className="font-medium max-w-60 truncate">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "job_position",
    header: "Position",
    size: 180,
    cell: ({ row }) => <div className="truncate max-w-42.5">{row.getValue("job_position")}</div>,
  },
  {
    accessorKey: "seniority_level",
    header: "Level",
    size: 120,
  },
  {
    accessorKey: "max_questions",
    header: "Questions",
    size: 100,
    cell: ({ row }) => <div className="font-mono pl-2">{row.getValue("max_questions")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => {
      const status: Interview["status"] = row.getValue("status");
      return (
        <Badge
          variant={status === "cancelled" ? "destructive" : "outline"}
          className={`capitalize ${statusClasses[status]}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    size: 160,
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string);

      const formattedDate = format(date, "MMM d, yyyy");
      const formattedTime = format(date, "h:mm a");

      return (
        <div className="flex flex-col text-left font-mono text-xs gap-0.5">
          <span className="text-foreground font-medium">{formattedDate}</span>
          <span className="text-muted-foreground text-[11px]">{formattedTime}</span>
        </div>
      );
    },
  },

  {
    id: "actions",
    size: 60,
    cell: ({ row, table }) => {
      const interview = row.original;
      const isDraft = interview.status === "draft";
      const isReady = ["ready", "ongoing", "completed"].includes(interview.status);

      const isAssignable = interview.status === "ready";

      // Check if THIS specific row is currently generating questions
      const meta = table.options.meta as InterviewTableMeta;
      const isGeneratingThisRow = meta?.generatingId === interview.id;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer" disabled={isGeneratingThisRow}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer gap-2">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" /> View Session
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={!isDraft || isGeneratingThisRow}
              className={`gap-2 ${isDraft ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              onClick={() => isDraft && meta?.onEditRow?.(interview)}
            >
              <Edit className="h-3.5 w-3.5 text-muted-foreground" /> Edit Info
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={!isDraft || isGeneratingThisRow}
              className={`gap-2 ${isDraft ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              onClick={() => {
                if (isDraft && !isGeneratingThisRow) {
                  meta?.onGenerateQuestions?.(interview);
                }
              }}
            >
              <Sparkles className={`h-3.5 w-3.5 text-muted-foreground ${isGeneratingThisRow ? "animate-spin" : ""}`} />
              <span className="flex-1 text-left">
                {isGeneratingThisRow ? "Generating..." : "Generate Questions"}
              </span>
              <Badge variant="secondary" className="text-[10px] px-1 py-0 uppercase tracking-wider font-semibold">
                AI
              </Badge>
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={!isReady || isGeneratingThisRow}
              className={`gap-2 ${isReady ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              onClick={() => {
                if (isReady && !isGeneratingThisRow) {
                  meta?.onViewQuestions?.(interview);
                }
              }}
            >
              <FileQuestion className="h-3.5 w-3.5 text-muted-foreground" /> View Questions
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={!isAssignable || isGeneratingThisRow}
              className={`gap-2 ${isAssignable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              onClick={() => {
                if (isAssignable && !isGeneratingThisRow) {
                  meta?.onAssignInterview?.(interview);
                }
              }}
            >
              <UserPlus className="h-3.5 w-3.5 text-muted-foreground" /> Assign Candidate
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={!isDraft || isGeneratingThisRow}
              className={`gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 ${isDraft ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
              onClick={() => {
                if (isDraft) {
                  meta?.onDeleteRow(interview);
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>



          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }
];