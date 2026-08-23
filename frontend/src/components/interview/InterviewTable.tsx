import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React from "react"
import { Input } from "../ui/input"
import { DataTablePagination } from "../shared/data-table-pagination"
import { DataTableViewOptions } from "../shared/data-table-view-options"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { ListFilter } from "lucide-react"
import CreateInterviewDialog from "./CreateInterviewDialog"
import type { Interview } from "@/features/interview/interviewTypes"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { deleteInterview, getAllInterviews } from "@/features/interview/interviewThunk"
import { generateQuestions, getQuestions } from "@/features/question/questionThunk"
import DeleteConfirmDialog from "../shared/delete-confirm-dialog"
import ViewQuestionsDialog from "./ViewQuestionsDialog"
import AssignCandidateDialog from "./AssignCandidateDialog"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function InterviewTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = React.useState(false);

  const [isAssignOpen, setIsAssignOpen] = React.useState(false);
  const [assigningInterview, setAssigningInterview] = React.useState<Interview | null>(null);

  const [editingInterview, setEditingInterview] = React.useState<Interview | null>(null);
  const [deletingInterview, setDeletingInterview] = React.useState<Interview | null>(null);
  const [viewingInterview, setViewingInterview] = React.useState<Interview | null>(null); // Add this state

  const globalLoading = useAppSelector((state) => state.interview.loading);

  const generatingId = useAppSelector((state) => state.question.generatingId);


const dispatch = useAppDispatch();
  const handleOpenChange = (open: boolean) => {
    setIsCreateOpen(open);
    if (!open) setEditingInterview(null);
  };

  const handleExecuteDelete = async () => {
    if (!deletingInterview) return;

    // Redundant workflow guard check
    if (deletingInterview.status !== "draft") {
      toast.error("Only interview templates in draft status can be permanently deleted.");
      setIsDeleteOpen(false);
      return;
    }
    const result = await dispatch(deleteInterview(deletingInterview.id));

    if (deleteInterview.fulfilled.match(result)) {
      toast.success("Interview session deleted successfully.");
      setIsDeleteOpen(false);
      setDeletingInterview(null);
    } else {
      toast.error((result.payload as string) ?? "Failed to delete interview.");
    }
  };

  const handleGenerateQuestions = async (interview: Interview) => {
    // Safety check matching your business rules
    if (interview.status !== "draft") {
      toast.error("Questions can only be generated for draft sessions.");
      return;
    }

    toast.info(`Starting AI question generation for "${interview.title}"...`);
    
const result = await dispatch(
  generateQuestions(interview.id)
);

if (generateQuestions.fulfilled.match(result)) {
  toast.success(
    "AI interview questions generated successfully!"
  );
  dispatch(getAllInterviews());
} else {
  toast.error(
    (result.payload as string) ??
      "Failed to generate AI questions."
  );
}
  };

const handleViewQuestions = (interview: Interview) => {
  setViewingInterview(interview);
  setIsQuestionsOpen(true);

  dispatch(getQuestions(interview.id));
};

  const handleAssignInterview = (interview: Interview) => {
  if (interview.status !== "ready") {
    toast.error("Only interviews in 'Ready' status can be assigned to candidates.");
    return;
  }
  setAssigningInterview(interview);
  setIsAssignOpen(true);
};

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange:setSorting,
    getSortedRowModel:getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    meta: {
      generatingId,
      onEditRow: (interview: Interview) => {
        setEditingInterview(interview);
        setIsCreateOpen(true);
      },
      onDeleteRow: (interview: Interview) => {
        setDeletingInterview(interview);
        setIsDeleteOpen(true);
      },
      onGenerateQuestions: (interview: Interview) => {
        handleGenerateQuestions(interview);
      },
      onViewQuestions: (interview: Interview) => {
        handleViewQuestions(interview); 
      },
      onAssignInterview: (interview: Interview) => {
      handleAssignInterview(interview);
    },
    },
    state:{
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }

  })

  const currentStatusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? ""

  return (
    <div>
      <div className="flex items-center py-4">
        
        <Input
          placeholder="Filter title "
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-52 mr-3"
        />

          {/* 2. Filter by Status Dropdown Component */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2 cursor-pointer border-dashed">
                <ListFilter className="h-4 w-4" />
                Status: {currentStatusFilter ? <span className="font-semibold capitalize text-primary">{currentStatusFilter}</span> : "All"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuCheckboxItem
                checked={currentStatusFilter === ""}
                onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
                className="cursor-pointer"
              >
                All
              </DropdownMenuCheckboxItem>
              {["draft", "ready", "ongoing", "completed", "cancelled"].map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  className="capitalize cursor-pointer"
                  checked={currentStatusFilter === status}
                  onClick={() => table.getColumn("status")?.setFilterValue(status)}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters Button (Shows up only if filters exist) */}
          {columnFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.resetColumnFilters()}
              className="h-9 px-2 text-xs cursor-pointer text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          )}
      
  <DataTableViewOptions table={table}/>

  <Button
   onClick={() =>{ 
    setEditingInterview(null)
    setIsCreateOpen(true)
   } }>Add Session</Button>
      </div>
    <div className="overflow-hidden rounded-md border mb-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

<DataTablePagination table={table}/>

<CreateInterviewDialog open={isCreateOpen} onOpenChange={handleOpenChange} interviewToEdit={editingInterview} />

<DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) setDeletingInterview(null);
        }}
        title={`Delete "${deletingInterview?.title || "Session"}"`}
        description="Are you sure you want to delete this session? This will remove all assigned configuration files permanently."
        isLoading={globalLoading}
        onConfirm={handleExecuteDelete}
      />

<ViewQuestionsDialog
        open={isQuestionsOpen}
        onOpenChange={(open) => {
          setIsQuestionsOpen(open);
          if (!open) setViewingInterview(null);
        }}
        interview={viewingInterview}
      />

      <AssignCandidateDialog
  open={isAssignOpen}
  onOpenChange={(open) => {
    setIsAssignOpen(open);
    if (!open) setAssigningInterview(null);
  }}
  interview={assigningInterview}
/>

    </div>
  )
}