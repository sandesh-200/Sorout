import React from "react";
import { Check } from "lucide-react";

export interface StepItem {
  id: number;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className = "" }) => {
  return (
    <nav aria-label="Progress Stepper" className={`w-full ${className}`}>
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <li key={step.id} className="flex-1 flex items-center relative">
              <div className="flex items-center gap-3">
                {/* Step Circle Indicator */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 border ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "border-primary bg-card text-primary ring-2 ring-primary/20"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-3" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>

                {/* Step Text Label */}
                <div className="hidden sm:flex flex-col">
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isCurrent || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="text-[10px] text-muted-foreground leading-none">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Connecting Line Separator */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-colors duration-300 ${
                    step.id < currentStep
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};