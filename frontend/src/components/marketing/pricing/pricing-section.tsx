import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import React from "react";
import { Button } from "@/components/ui/button";
import { type FREQUENCY, FrequencyToggle } from "./frequency-toggle";
import { StarIcon, CheckCircleIcon } from "lucide-react";

type Plan = {
	name: string;
	info: string;
	price: {
		monthly: number;
		yearly: number; 
	};
	features: string[];
	btn: {
		text: string;
		href: string;
	};
	highlighted?: boolean;
};

const plans: Plan[] = [
	{
		name: "Starter / Beta",
		info: "Best for trying out AI candidate screening",
		price: {
			monthly: 0,
			yearly: 0,
		},
		features: [
			"Up to 5 Candidate Interviews / mo",
			"Standard Technical & DSA Rubrics",
			"Instant Evaluation Reports",
			"Basic Anti-Cheat Detection",
			"Community Support",
		],
		btn: {
			text: "Try for Free",
			href: "/signup",
		},
	},
	{
		highlighted: true,
		name: "Pro",
		info: "For growing startups & hiring managers",
		price: {
			monthly: 49,
			yearly: 39,
		},
		features: [
			"Up to 50 Candidate Interviews / mo",
			"Custom Coding & Technical Rubrics",
			"Audio Transcripts & Highlighting",
			"Full Scorecard & Candidate Ranking",
			"Anti-Cheat & Proctoring Alerts",
			"Priority Email Support",
		],
		btn: {
			text: "Get Started",
			href: "/signup",
		},
	},
	{
		name: "Scale",
		info: "For high-volume hiring and agencies",
		price: {
			monthly: 149,
			yearly: 119,
		},
		features: [
			"Up to 200 Candidate Interviews / mo",
			"Custom AI Evaluation Benchmarks",
			"Multi-interviewer Team Access",
			"Full Session Audio Replay",
			"Export Reports to PDF",
			"Dedicated Support Channel",
		],
		btn: {
			text: "Contact Us",
			href: "/contact",
		},
	},
];

export function PricingSection() {
	const [frequency, setFrequency] = React.useState<"monthly" | "yearly">(
		"monthly"
	);

	return (
		<div className="flex w-full flex-col items-center justify-center space-y-7 p-4">
			<div className="mx-auto max-w-2xl space-y-2">
				<h2 className="text-center  text-3xl tracking-tight font-semibold md:text-3xl lg:text-4xl">
					Simple, Scalable Pricing
				</h2>
				<p className="text-center text-muted-foreground text-sm md:text-base">
					Screen candidates faster with AI. Start for free during our early access phase.
				</p>
			</div>

			<FrequencyToggle frequency={frequency} setFrequency={setFrequency} />
			<div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
				{plans.map((plan) => (
					<PricingCard frequency={frequency} key={plan.name} plan={plan} />
				))}
			</div>
		</div>
	);
}

type PricingCardProps = React.ComponentProps<"div"> & {
	plan: Plan;
	frequency?: FREQUENCY;
};

export function PricingCard({
	plan,
	className,
	frequency = "monthly",
	...props
}: PricingCardProps) {
	const price = plan.price[frequency];

	return (
		<div
			className={cn(
				"relative flex w-full flex-col overflow-hidden rounded-lg border shadow-xs transition-all duration-200",
				plan.highlighted && "scale-105 border-primary/50 shadow-md",
				className
			)}
			key={plan.name}
			{...props}
		>
			<div
				className={cn(
					"border-b p-4 relative",
					plan.highlighted && "bg-card dark:bg-card/80"
				)}
			>
				<AnimatePresence mode="wait">
					<div className="absolute top-2 right-2 z-10 flex items-center gap-2">
						{plan.highlighted && (
							<motion.div
								className="flex items-center gap-1 rounded-md border bg-background px-2 py-0.5 text-xs font-medium"
								key="popular-badge"
								layout
								transition={{ duration: 0.1 }}
							>
								<StarIcon className="size-3 fill-current text-yellow-500" />
								Most Popular
							</motion.div>
						)}

						{frequency === "yearly" &&
							plan.price.monthly > plan.price.yearly && (
								<motion.div
									animate={{ opacity: 1, scale: 1 }}
									className="flex items-center gap-1 rounded-md border bg-primary px-2 py-0.5 text-primary-foreground text-xs font-medium"
									exit={{ opacity: 0, scale: 0.95 }}
									initial={{ opacity: 0, scale: 0.95 }}
									key="discount-badge"
									layout
									transition={{ duration: 0.15 }}
								>
									{Math.round(
										((plan.price.monthly - plan.price.yearly) /
											plan.price.monthly) *
											100
									)}
									% off
								</motion.div>
							)}
					</div>
				</AnimatePresence>

				<div className="font-medium text-lg">{plan.name}</div>
				<p className="font-normal text-muted-foreground text-sm">{plan.info}</p>

				{/* Price Display */}
				<h3 className="mt-6 mb-1 flex items-baseline gap-1">
					<AnimatePresence mode="wait">
						<motion.span
							key={price}
							initial={{ opacity: 0, y: -4 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 4 }}
							transition={{ duration: 0.15 }}
							className="font-extrabold text-3xl text-foreground"
						>
							${price}
						</motion.span>
					</AnimatePresence>
					<span className="font-normal text-base text-muted-foreground">
						{price === 0 ? "" : "/month"}
					</span>
				</h3>

				<p className="mb-2 font-normal text-muted-foreground text-xs">
					{price === 0 ? "Forever free" : `billed ${frequency}`}
				</p>
			</div>

			<div
				className={cn(
					"space-y-3 px-4 pt-6 pb-8 text-muted-foreground text-sm",
					plan.highlighted && "bg-muted/10"
				)}
			>
				{plan.features.map((feature) => (
					<div className="flex items-center gap-2" key={feature}>
						<CheckCircleIcon className="size-3.5 text-foreground shrink-0" />
						<p>{feature}</p>
					</div>
				))}
			</div>

			<div
				className={cn(
					"mt-auto w-full border-t p-3",
					plan.highlighted && "bg-card dark:bg-card/80"
				)}
			>
				<Button
					asChild
					className="w-full"
					variant={plan.highlighted ? "default" : "outline"}
				>
					<Link to={plan.btn.href}>{plan.btn.text}</Link>
				</Button>
			</div>
		</div>
	);
}