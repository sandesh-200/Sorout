import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";



import { ProtectedRoute } from "./ProtectedRoute";


import AdminLayout from "@/layouts/AdminLayout";
import Interviews from "@/pages/admin/Interviews";
import CandidateLayout from "@/layouts/CandidateLayout";
import CandidateInterviews from "@/pages/candidate/CandidateInterviews";
import InterviewInstructionsPage from "@/pages/candidate/InterviewInstructionsPage";
import InterviewWorkspace from "@/pages/candidate/InterviewWorkspace";
import InterviewResultPage from "@/pages/candidate/InterviewResultPage";
import ConversationalWorkspace from "@/pages/candidate/ConversationalWorkspace";

const AnalyticsPage = () => (
  <div className="space-y-2">
    <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
    <p className="text-muted-foreground">Welcome back!</p>
  </div>
);

const UnauthorizedPage = () => (
  <div className="flex h-screen items-center justify-center">
    <h1 className="text-2xl font-semibold">
      Unauthorized
    </h1>
  </div>
);

export default function AppRouter() {
  return (
    <Routes>
      {/* Redirect */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Public */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/signup"
        element={<SignupPage />}
      />

      <Route
        path="/unauthorized"
        element={<UnauthorizedPage />}
      />

      {/* ---------------- ADMIN ---------------- */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin/dashboard"
          element={<AnalyticsPage />}
        />

        <Route
          path="/admin/interviews"
          element={<Interviews />}
        />
      </Route>

      {/* ---------------- CANDIDATE ---------------- */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["candidate"]}
          >
            <CandidateLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/candidate/interviews"
          element={<CandidateInterviews />}
        />

        <Route path="/candidate/interviews/:sessionId/instructions" element={<InterviewInstructionsPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <ConversationalWorkspace />
          </ProtectedRoute>
        }
        path="/candidate/workspace/:sessionId"
      />

      <Route
        element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <InterviewResultPage />
          </ProtectedRoute>
        }
        path="/candidate/result/:sessionId"
      />

      {/* Must be last — catches all unknown paths */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}