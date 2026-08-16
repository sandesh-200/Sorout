import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, Info, PartyPopper, ArrowRight, type LucideIcon } from "lucide-react";

export type ModalVariant = "success" | "info" | "warning" | "celebrate";

export interface StatusModalProps {
  /** Controls modal visibility */
  open: boolean;

  onDismiss: () => void;
  /** Main heading */
  title?: React.ReactNode;
  /** Subtitle or detail paragraph */
  description?: React.ReactNode;
  /** Visual theme variant (default: "success") */
  variant?: ModalVariant;
  /** Override default icon with a custom Lucide icon or React element */
  customIcon?: LucideIcon | React.ReactNode;
  /** Label for the primary button (default: "Continue") */
  primaryCtaLabel?: string;
  /** Primary button action (defaults to `onDismiss` if omitted) */
  onPrimaryAction?: () => void;
  /** Optional secondary button label (e.g., "Cancel" or "View details") */
  secondaryCtaLabel?: string;
  /** Optional secondary button callback */
  onSecondaryAction?: () => void;
  /** Inject custom React content between description and buttons */
  children?: React.ReactNode;
  /** Additional CSS classes for the modal card container */
  className?: string;
}

const VARIANT_CONFIGS: Record<
  ModalVariant,
  { icon: LucideIcon; bgClass: string; textClass: string; ringClass: string }
> = {
  success: {
    icon: Check,
    bgClass: "bg-emerald-500/10 dark:bg-emerald-500/20",
    textClass: "text-emerald-600 dark:text-emerald-400",
    ringClass: "ring-emerald-500/10",
  },
  info: {
    icon: Info,
    bgClass: "bg-blue-500/10 dark:bg-blue-500/20",
    textClass: "text-blue-600 dark:text-blue-400",
    ringClass: "ring-blue-500/10",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-amber-500/10 dark:bg-amber-500/20",
    textClass: "text-amber-600 dark:text-amber-400",
    ringClass: "ring-amber-500/10",
  },
  celebrate: {
    icon: PartyPopper,
    bgClass: "bg-purple-500/10 dark:bg-purple-500/20",
    textClass: "text-purple-600 dark:text-purple-400",
    ringClass: "ring-purple-500/10",
  },
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const StatusModal: React.FC<StatusModalProps> = ({
  open,
  onDismiss,
  title = "All done!",
  description,
  variant = "success",
  customIcon,
  primaryCtaLabel = "Continue",
  onPrimaryAction,
  secondaryCtaLabel,
  onSecondaryAction,
  children,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const config = VARIANT_CONFIGS[variant];

  // Lock scroll & handle focus trap setup
  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    const timeout = setTimeout(() => {
      primaryButtonRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    };
  }, [open]);

  // Keyboard accessibility
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onDismiss();
      return;
    }

    if (event.key === "Tab" && modalRef.current) {
      const focusables = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const handlePrimaryClick = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      onDismiss();
    }
  };

  // Icon Resolver
  const renderIcon = () => {
    if (customIcon) {
      if (typeof customIcon === "function") {
        const IconComponent = customIcon as LucideIcon
        return <IconComponent className="h-6 w-6 stroke-[2.5]" />
      }

      return customIcon
    }

    const IconComponent = config.icon
    return <IconComponent className="h-6 w-6 stroke-[2.5]" />
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          role="region"
          aria-label="Status Dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onDismiss}
            className="fixed inset-0 bg-background/80 backdrop-blur-xs"
          />

          {/* Dialog Container */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card p-6 text-center shadow-lg sm:p-7 ${className}`}
          >
            {/* Animated Icon Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.25, ease: "easeOut" }}
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${config.bgClass} ${config.textClass} ring-8 ${config.ringClass}`}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                  delay: 0.18,
                  duration: 0.35,
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                }}
              >
                {renderIcon()}
              </motion.div>
            </motion.div>

            {/* Header / Text Content */}
            <div className="mt-4 space-y-1.5">
              <h2 className="text-lg font-semibold tracking-tight text-card-foreground">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Custom Content Slot */}
            {children && <div className="mt-4 text-left">{children}</div>}

            {/* Actions Footer */}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {secondaryCtaLabel && (
                <button
                  type="button"
                  onClick={onSecondaryAction || onDismiss}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
                >
                  {secondaryCtaLabel}
                </button>
              )}

              <button
                ref={primaryButtonRef}
                type="button"
                onClick={handlePrimaryClick}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{primaryCtaLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};