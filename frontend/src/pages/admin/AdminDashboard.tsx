import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchDashboardData } from "@/features/dashboard/dashboardThunk";
import { DashboardMetricCards } from "@/components/dashboard/DashboardMetricCards";
import { CandidateFunnelCard } from "@/components/dashboard/CandidateFunnelCard";
import { RecentEvaluationsTable } from "@/components/dashboard/RecentEvaluationsTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RefreshCw, AlertCircle, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboardData());
  };

  if (loading && !data) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Failed to load Dashboard Data</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Overview</h1>
          <p className="text-sm text-muted-foreground">
            Monitor candidate progress, interview sessions, and system-wide evaluation scores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" asChild>
            <Link to="/admin/interviews">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Interview
            </Link>
          </Button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      {data?.summary && <DashboardMetricCards summary={data.summary} />}

      {/* Main Grid: Recent Interviews & Status Breakdown */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recent_interviews && (
              <RecentEvaluationsTable interviews={data.recent_interviews} />
            )}
          </CardContent>
        </Card>

        <div>
          {data?.interview_statuses && <CandidateFunnelCard interviewStatuses={data.interview_statuses} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;