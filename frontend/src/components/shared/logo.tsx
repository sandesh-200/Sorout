import { cn } from "@/lib/utils";
import React from "react";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
	showText?: boolean;
	imgClassName?: string;
	textClassName?: string;
}

export function Logo({
	className,
	imgClassName,
	textClassName,
	showText = true,
	...props
}: LogoProps) {
	return (
		<div
			className={cn(
				"inline-flex items-center gap-2 font-bold tracking-tight select-none",
				className
			)}
			{...props}
		>
			<img
				alt="Sorout Logo"
				className={cn(
					"size-8 object-contain mix-blend-multiply dark:mix-blend-normal",
					imgClassName
				)}
				src="/images/logo.png"
			/>
			{showText && (
				<span className={cn("text-xl font-semibold", textClassName)}>
					Sorout
				</span>
			)}
		</div>
	);
}