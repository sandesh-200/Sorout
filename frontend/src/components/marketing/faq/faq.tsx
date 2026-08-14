import {
  Activity,
  Brain,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  FileCheck,
  Globe,
  HelpCircle,
  Lock,
  MessageCircle,
  Scale,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Undo2,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const ANIMATION_DURATION = 0.3;
const SPRING_STIFFNESS = 500;
const SPRING_DAMPING = 30;
const HOVER_SCALE = 1.02;
const TAP_SCALE = 0.98;
const FAQ_STAGGER_DELAY = 0.08;
const INITIAL_Y_OFFSET = 16;
const EXIT_Y_OFFSET = -16;

const iconMap = {
  Activity,
  Brain,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  FileCheck,
  Globe,
  HelpCircle,
  Lock,
  MessageCircle,
  Scale,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Undo2,
  Users,
  WalletCards,
  Zap,
};

interface FaqsGridProps {
  categories?: Array<{
    name: string;
    id: string;
    faqs: Array<{
      question: string;
      answer: string;
      icon: string;
    }>;
  }>;
  description?: string;
  title?: string;
}

export function FaqsGrid({
  title = "Frequently Asked Questions",
  description = "Everything you need to know about Sorout's AI interviewing platform, candidate evaluations, and integration workflows.",
  categories = [
    {
      faqs: [
        {
          answer:
            "Sorout is an automated candidate evaluation platform. It conducts structured AI-driven interviews and provides instant, objective scorecards to help hiring managers make faster data-backed decisions.",
          icon: "Sparkles",
          question: "What is Sorout?",
        },
        {
          answer:
            "Simply upload or paste your Job Description (JD). Sorout automatically analyzes the required technical skills and soft skills to generate a customized interview script and grading rubric.",
          icon: "FileCheck",
          question: "How are interview questions generated?",
        },
        {
          answer:
            "Yes! You can test Sorout completely free with initial candidate interview credits. No credit card is required to set up your first interview session.",
          icon: "Zap",
          question: "Is there a free tier to test candidates?",
        },
      ],
      id: "product",
      name: "Product & Setup",
    },
    {
      faqs: [
        {
          answer:
            "Each candidate is evaluated against your specific rubric. Sorout analyzes technical accuracy, communication clarity, problem-solving structure, and key domain competencies to output a detailed scorecard.",
          icon: "Brain",
          question: "How does Sorout evaluate candidate responses?",
        },
        {
          answer:
            "No. Sorout acts as a first-round filter and force multiplier. It automates repetitive initial screening phone screens so hiring teams can spend their time on high-conviction live interviews.",
          icon: "Users",
          question: "Does Sorout replace human interviewers?",
        },
        {
          answer:
            "Immediately after the candidate completes their response set. The detailed breakdown and evaluation metrics are available on your dashboard in under 60 seconds.",
          icon: "Clock",
          question: "How fast are candidate reports generated?",
        },
      ],
      id: "evaluations",
      name: "Evaluations & AI",
    },
    {
      faqs: [
        {
          answer:
            "We prioritize privacy. Candidate audio recordings and transcribed texts are encrypted in transit and at rest. Your data is strictly kept private and never used to train public foundation models.",
          icon: "ShieldCheck",
          question: "How is candidate audio & interview data secured?",
        },
        {
          answer:
            "Yes. Every candidate scorecard comes with a secure shareable link that you can forward to recruiters, hiring managers, or clients without giving them full admin access.",
          icon: "MessageCircle",
          question: "Can I share evaluation reports with my team?",
        },
        {
          answer:
            "Candidates only need a modern web browser and a working microphone or phone. There are zero downloads or browser extensions required to start an interview.",
          icon: "CheckCircle2",
          question: "What do candidates need to take an interview?",
        },
      ],
      id: "security",
      name: "Security & Workflow",
    },
  ],
}: FaqsGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-muted/50 py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="max-w-2xl">
				<h2 className="text-3xl tracking-tight font-semibold md:text-3xl lg:text-4xl">
					{title}
				</h2>
          <p className="mt-5 text-balance text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mt-12 md:mt-16">
          <div className="flex flex-wrap gap-3 border-b border-border/60 pb-px md:gap-4">
            {categories.map((category, index) => (
              <motion.button
                className={`relative cursor-pointer rounded-t-xl px-5 py-3 font-medium text-sm transition-all duration-200 ${
                  activeTab === index
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/40 hover:text-foreground"
                }`}
                key={category.id}
                onClick={() => setActiveTab(index)}
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: HOVER_SCALE }}
                whileTap={shouldReduceMotion ? {} : { scale: TAP_SCALE }}
              >
                {category.name}
                {activeTab === index && (
                  <motion.div
                    className="absolute inset-x-0 bottom-0 h-0.5 rounded-t-full bg-primary"
                    initial={false}
                    layoutId={shouldReduceMotion ? undefined : "activeTab"}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            damping: SPRING_DAMPING,
                            stiffness: SPRING_STIFFNESS,
                            type: "spring" as const,
                          }
                    }
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-10 md:mt-14">
          <AnimatePresence mode="wait">
            <motion.div
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, y: EXIT_Y_OFFSET }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: INITIAL_Y_OFFSET }
              }
              key={activeTab}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: ANIMATION_DURATION, ease: "easeInOut" }
              }
            >
              <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                {categories[activeTab].faqs.map((faq, faqIndex) => {
                  const IconComponent =
                    iconMap[faq.icon as keyof typeof iconMap] || HelpCircle;

                  return (
                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 1, y: 0 }
                      }
                      className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-6 shadow-xs backdrop-blur-xs transition-colors hover:border-border/80 hover:bg-card md:p-8"
                      initial={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: INITIAL_Y_OFFSET }
                      }
                      key={`${categories[activeTab].id}-${faqIndex}`}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                              delay: faqIndex * FAQ_STAGGER_DELAY,
                              duration: 0.4,
                            }
                      }
                    >
                      <div className="space-y-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-muted/60 text-foreground shadow-2xs">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <dt className="text-lg font-semibold tracking-tight text-foreground">
                          {faq.question}
                        </dt>
                        <dd className="text-base leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </dd>
                      </div>
                    </motion.div>
                  );
                })}
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default FaqsGrid;