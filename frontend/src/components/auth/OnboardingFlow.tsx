import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Building2,
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  Briefcase,
  Loader2,
} from "lucide-react";
import { Stepper, type StepItem } from "@/components/shared/stepper";

export type UserRoleType = "admin" | "candidate";

export interface OnboardingData {
  role: UserRoleType;
  user_name: string;
  organization_name?: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => Promise<void> | void;
  isSubmitting?: boolean;
}

const steps: StepItem[] = [
  { id: 1, label: "Account Setup", description: "Select workspace role" },
  { id: 2, label: "Profile Setup", description: "Basic details" },
];

const slideVariants: Variants = {
  hidden: (direction: number) => ({
    x: direction > 0 ? 24 : -24,
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 24 : -24,
    opacity: 0,
    transition: { duration: 0.18, ease: [0.7, 0, 0.84, 0] },
  }),
};

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  isSubmitting = false,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<UserRoleType | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");

  const handleRoleSelect = (role: UserRoleType) => {
    setSelectedRole(role);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedRole) {
      setDirection(1);
      setStep(2);
    }
  };

  const handleBackStep = () => {
    if (step === 2) {
      setDirection(-1);
      setStep(1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setInputError("Please enter your full name");
      return;
    }
    if (selectedRole === "admin" && !organizationName.trim()) {
      setInputError("Please enter your organization name");
      return;
    }

    if (selectedRole) {
      setInputError("");
      onComplete({
        role: selectedRole,
        user_name: userName.trim(),
        ...(selectedRole === "admin" ? { organization_name: organizationName.trim() } : {}),
      });
    }
  };

  const isRoleAdmin = selectedRole === "admin";

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6 text-foreground antialiased">
      <div className="w-full max-w-xl bg-card border border-border rounded-xl shadow-sm overflow-hidden transition-all">
        
        {/* Shadcn Header Stepper */}
        <div className="px-6 sm:px-8 pt-8 pb-4 border-b border-border bg-card">
          <Stepper steps={steps} currentStep={step} />
        </div>

        <div className="p-6 sm:p-8 flex flex-col justify-between min-h-105">
          <div>
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 ? (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="mb-6 space-y-1.5">
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-card-foreground">
                      How do you plan to use the platform?
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Select your primary role to customize your workspace experience.
                    </p>
                  </div>

                  {/* Role Cards */}
                  <div
                    role="radiogroup"
                    aria-label="Select your role"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6"
                  >
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedRole === "admin"}
                      onClick={() => handleRoleSelect("admin")}
                      className={`group relative text-left rounded-lg p-5 border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring flex flex-col justify-between ${
                        selectedRole === "admin"
                          ? "border-primary bg-primary/10 ring-1 ring-primary/20 shadow-xs"
                          : "border-border bg-card hover:bg-muted/40 hover:border-border/80"
                      }`}
                    >
                      <div className="flex items-start justify-between w-full mb-4">
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                            selectedRole === "admin"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground group-hover:text-foreground"
                          }`}
                        >
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            selectedRole === "admin"
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border opacity-40 group-hover:opacity-100"
                          }`}
                        >
                          {selectedRole === "admin" && (
                            <Check className="w-3 h-3 stroke-3" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-card-foreground mb-1">
                          Organization / Admin
                        </h3>
                        <p className="text-xs text-muted-foreground leading-normal">
                          Set up assessments, manage candidates, and conduct interviews.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedRole === "candidate"}
                      onClick={() => handleRoleSelect("candidate")}
                      className={`group relative text-left rounded-lg p-5 border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring flex flex-col justify-between ${
                        selectedRole === "candidate"
                          ? "border-primary bg-primary/10 ring-1 ring-primary/20 shadow-xs"
                          : "border-border bg-card hover:bg-muted/40 hover:border-border/80"
                      }`}
                    >
                      <div className="flex items-start justify-between w-full mb-4">
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                            selectedRole === "candidate"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground group-hover:text-foreground"
                          }`}
                        >
                          <User className="w-5 h-5" />
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            selectedRole === "candidate"
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border opacity-40 group-hover:opacity-100"
                          }`}
                        >
                          {selectedRole === "candidate" && (
                            <Check className="w-3 h-3 stroke-3" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-card-foreground mb-1">
                          Candidate
                        </h3>
                        <p className="text-xs text-muted-foreground leading-normal">
                          Complete assessments, build your profile, and respond to invitations.
                        </p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="mb-6 space-y-1.5">
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-card-foreground">
                      {isRoleAdmin
                        ? "What is your organization's name?"
                        : "What is your full name?"}
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isRoleAdmin
                        ? "This will be visible to candidates during interview sessions."
                        : "This will be shared with interviewers during your assessments."}
                    </p>
                  </div>

                  <form id="onboarding-form" onSubmit={handleSubmit} className="my-6 space-y-4">
                    {/* Full Name Input */}
                    <div className="space-y-2">
                      <label
                        htmlFor="userNameInput"
                        className="block text-xs font-medium text-foreground"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="userNameInput"
                          type="text"
                          value={userName}
                          onChange={(e) => {
                            setUserName(e.target.value);
                            if (inputError) setInputError("");
                          }}
                          placeholder="Alex Morgan"
                          autoFocus
                          disabled={isSubmitting}
                          className={`w-full pl-10 pr-4 py-2.5 bg-background rounded-lg border text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 ${
                            inputError && !userName.trim()
                              ? "border-destructive focus:ring-destructive/30"
                              : "border-border focus:border-primary focus:ring-primary/20"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Organization Name Input (Admin Only) */}
                    {isRoleAdmin && (
                      <div className="space-y-2">
                        <label
                          htmlFor="orgNameInput"
                          className="block text-xs font-medium text-foreground"
                        >
                          Organization Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <input
                            id="orgNameInput"
                            type="text"
                            value={organizationName}
                            onChange={(e) => {
                              setOrganizationName(e.target.value);
                              if (inputError) setInputError("");
                            }}
                            placeholder="Acme Corp"
                            disabled={isSubmitting}
                            className={`w-full pl-10 pr-4 py-2.5 bg-background rounded-lg border text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 ${
                              inputError && !organizationName.trim()
                                ? "border-destructive focus:ring-destructive/30"
                                : "border-border focus:border-primary focus:ring-primary/20"
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {inputError && (
                      <p className="text-xs text-destructive font-medium pt-0.5">
                        {inputError}
                      </p>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Actions Bar */}
          <div className="pt-6 border-t border-border flex items-center justify-between">
            {step === 2 ? (
              <button
                type="button"
                onClick={handleBackStep}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-2 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            <div>
              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!selectedRole}
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all flex items-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="onboarding-form"
                  disabled={isSubmitting || !userName.trim() || (isRoleAdmin && !organizationName.trim())}
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all flex items-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};