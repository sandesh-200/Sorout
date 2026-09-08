import React from "react";
import { Users, FileText, Activity, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type DashboardSummary } from "@/features/dashboard/dashboardTypes";

interface DashboardMetricCardsProps {
  summary: DashboardSummary;
}

export const DashboardMetricCards: React.FC<DashboardMetricCardsProps> = ({ summary }) => {
  const avgScore = summary.average_score !== null ? summary.average_score.toFixed(1) : "—";

  const cards = [
    {
      title: "Total Candidates",
      value: summary.total_candidates,
      sub: `${summary.evaluated_sessions} evaluated`,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Interviews",
      value: summary.total_interviews,
      sub: "Interview templates",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Sessions",
      value: summary.total_sessions,
      sub: `${summary.completed_sessions} completed`,
      icon: <Activity className="h-4 w-4 text-primary" />,
    },
    {
      title: "Avg Evaluation Score",
      value: avgScore === "—" ? avgScore : `${avgScore} / 10`,
      sub: summary.evaluated_sessions > 0 ? `${summary.evaluated_sessions} sessions evaluated` : "No evaluations yet",
      icon: <Award className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
