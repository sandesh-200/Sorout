import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { type RecentInterview } from "@/features/dashboard/dashboardTypes";
import { format } from "date-fns";

interface RecentInterviewsTableProps {
  interviews: RecentInterview[];
}

const STATUS_VARIANT: Record<RecentInterview["status"], "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  ongoing: "secondary",
  ready: "outline",
  draft: "outline",
  cancelled: "destructive",
};

export const RecentEvaluationsTable: React.FC<RecentInterviewsTableProps> = ({ interviews }) => {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Interview</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Candidates</TableHead>
            <TableHead>Avg Score</TableHead>
            <TableHead className="text-right">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No interviews found.
              </TableCell>
            </TableRow>
          ) : (
            interviews.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div>{item.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{item.seniority_level}</div>
                </TableCell>
                <TableCell>{item.job_position}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[item.status]} className="capitalize">
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span>{item.candidate_count}</span>
                  {item.evaluated_count > 0 && (
                    <span className="text-muted-foreground text-xs ml-1">({item.evaluated_count} eval.)</span>
                  )}
                </TableCell>
                <TableCell>
                  {item.average_score !== null ? (
                    <span className="font-semibold">{item.average_score.toFixed(1)} / 10</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {format(new Date(item.created_at), "MMM d, yyyy")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};