import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/app/hooks";
import { useAuth } from "@/hooks/useAuth";
import { completeUserOnboarding } from "@/features/user/userThunk";

import { OnboardingFlow, type OnboardingData } from "../components/auth/OnboardingFlow";
import { StatusModal } from "@/components/shared/StatusModal";

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { fetchUser } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedData, setCompletedData] = useState<OnboardingData | null>(null);

  const handleComplete = async (data: OnboardingData) => {
    setSubmitting(true);
    try {
      await dispatch(completeUserOnboarding(data)).unwrap();
      setCompletedData(data);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to complete onboarding", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNavigateDashboard = async () => {
    setShowSuccessModal(false);
    try {
      await fetchUser();
    } catch (err) {
      console.error("Failed to refetch user", err);
    }

    if (completedData?.role === "admin") {
      navigate("/admin/interviews", { replace: true });
    } else {
      navigate("/candidate/interviews", { replace: true });
    }
  };

  return (
    <>
      <OnboardingFlow onComplete={handleComplete} isSubmitting={submitting} />

      <StatusModal
        open={showSuccessModal}
        variant="success"
        title={
          completedData?.role === "admin"
            ? "Your Workspace is Ready"
            : `Welcome, ${completedData?.user_name}`
        }
        description={
          completedData?.role === "admin"
            ? `'${completedData.organization_name}' has been successfully configured. Head over to your dashboard to manage candidates and schedule interview sessions.`
            : "Your setup is complete. Head over to your candidate portal to view pending interview invitations and upcoming assessments."
        }
        primaryCtaLabel="Go to Dashboard"
        onPrimaryAction={handleNavigateDashboard}
        onDismiss={handleNavigateDashboard}
      />
    </>
  );
};

export default OnboardingPage;