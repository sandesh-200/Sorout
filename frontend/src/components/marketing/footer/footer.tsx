import { useRef } from "react";
import { TimelineAnimation } from "./timeline-animation";

export const BoldFooter = () => {
  const footerRef = useRef<HTMLElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="w-full bg-background text-foreground overflow-hidden border-t border-border font-sans transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Top Section Wrapper */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          
          {/* Animated Element 0: CTA & Email */}
          <TimelineAnimation animationNum={0} timelineRef={footerRef} className="max-w-md">
            <h2 className="text-3xl font-bold tracking-tight text-pretty mb-6">
              Ready to automate candidate screening? Let's transform your hiring workflow.
            </h2>
            <a
              href="mailto:contact@sorout.ai"
              className="text-lg font-medium border-b-2 border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-all"
            >
              contact@sorout.ai
            </a>
          </TimelineAnimation>

          {/* Animated Element 1: Location & Socials Grid */}
          <TimelineAnimation animationNum={1} timelineRef={footerRef} className="grid grid-cols-2 gap-12 sm:gap-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Platform
              </p>
              <nav className="flex flex-col gap-2 text-sm">
                <a href="#features" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  AI Interviews
                </a>
                <a href="#evaluations" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  JD Rubrics
                </a>
                <a href="#pricing" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </nav>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Connect
              </p>
              <nav className="flex flex-col gap-2 text-sm">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  LinkedIn
                </a>
                <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  X / Twitter
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  GitHub
                </a>
              </nav>
            </div>
          </TimelineAnimation>
        </div>

        {/* Animated Element 2: Background Watermark & Bottom Bar */}
        <div className="relative w-full">
          <TimelineAnimation animationNum={2} timelineRef={footerRef}>
            <h1 className="text-[12vw] font-black tracking-tighter text-foreground select-none pointer-events-none leading-none -mb-[2vw] opacity-[0.04] dark:opacity-[0.06]">
              SOROUT
            </h1>
          </TimelineAnimation>

          <TimelineAnimation
            animationNum={3}
            timelineRef={footerRef}
            className="flex justify-between items-end border-t border-border backdrop-blur pt-8 pb-6 relative z-10"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              © 2026 Sorout AI, Inc.
            </span>
            <div className="flex gap-8">
              <span className="text-xs text-muted-foreground">v1.0 — 2026</span>
              <button
                onClick={scrollToTop}
                className="text-xs font-bold uppercase tracking-widest hover:text-muted-foreground transition-colors cursor-pointer"
              >
                Back to top ↑
              </button>
            </div>
          </TimelineAnimation>
        </div>

      </div>
    </footer>
  );
};

export default BoldFooter;