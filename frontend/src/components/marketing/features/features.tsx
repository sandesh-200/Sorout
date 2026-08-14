import { useState } from "react";

import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FeatureItem {
  id: number;
  title: string;
  image: string;
  description: string;
}

interface FeatureProps {
  features?: FeatureItem[];
  className?: string;
}

const Feature = ({
  features = [
    {
      id: 1,
      title: "Automated AI Interviews",
      image: "/images/feature_1.png",
      description:
        "Screen candidates 24/7 without spending hours on initial phone screens. Sorout conducts structured audio interviews using natural, context-aware AI.",
    },
    {
      id: 2,
      title: "Custom JD-to-Rubric Generation",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      description:
        "Paste your job description and Sorout automatically extracts core competencies, generating tailored interview questions and scoring criteria in seconds.",
    },
    {
      id: 3,
      title: "Instant Evaluation Scorecards",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
      description:
        "Get objective ratings on technical skills, communication, and domain knowledge immediately after the interview, backed by complete response transcripts.",
    },
    {
      id: 4,
      title: "Seamless Recruiter Workflows",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      description:
        "Share candidate scorecards via secure external links to hiring managers or clients, streamlining feedback loops and accelerating hiring decisions.",
    },
  ],
  className,
}: FeatureProps) => {
  const [activeTabId, setActiveTabId] = useState<number | null>(1);
  const [activeImage, setActiveImage] = useState(features[0].image);

  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 max-w-2xl">
				<h2 className="text-3xl tracking-tight font-semibold md:text-3xl lg:text-4xl">
					Screen Smarter
				</h2>
        </div>

        <div className="flex w-full items-stretch justify-between gap-6 lg:gap-10">
          <div className="flex w-full flex-col justify-center md:w-1/2">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="item-1"
              onValueChange={(val) => {
                if (!val) return;
                const selectedId = Number(val.replace("item-", ""));
                const selectedFeature = features.find((f) => f.id === selectedId);
                if (selectedFeature) {
                  setActiveTabId(selectedFeature.id);
                  setActiveImage(selectedFeature.image);
                }
              }}
            >
              {features.map((tab) => (
                <AccordionItem
                  key={tab.id}
                  value={`item-${String(tab.id)}`}
                  className="border-border/60 transition-opacity hover:opacity-90"
                >
                  <AccordionTrigger className="cursor-pointer py-3 md:py-4 !no-underline transition">
                    <h4
                      className={`text-base font-semibold md:text-lg ${
                        tab.id === activeTabId
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {tab.title}
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    <p>{tab.description}</p>
                    <div className="mt-3 md:hidden">
                      <img
                        src={tab.image}
                        alt={tab.title}
                        className="h-full max-h-64 w-full rounded-lg object-cover"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="relative hidden w-1/2 overflow-hidden rounded-2xl border border-border/60 bg-muted/40 p-2 md:block">
            <div className="relative h-full min-h-[260px] w-full overflow-hidden rounded-xl">
              {features.map((feature) => (
                <img
                  key={feature.id}
                  src={feature.image}
                  alt={feature.title}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                    activeImage === feature.image ? "opacity-100" : "opacity-0"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Features() {
  return <Feature />;
}