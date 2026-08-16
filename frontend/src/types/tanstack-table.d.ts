import "@tanstack/react-table";
import type { Interview } from "@/features/interview/interviewTypes";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    generatingId: number | null;
    onEditRow?: (interview: Interview) => void;
    onDeleteRow?: (interview: Interview) => void;
    onGenerateQuestions: (interview: Interview) => void;
    onViewQuestions: (interview: Interview) => void;
    onAssignInterview: (interview: Interview) => void;
  }
}