import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface PortalProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	container?: HTMLElement | null;
}

export function Portal({
	children,
	className,
	container,
	...props
}: PortalProps) {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
		// Prevent background scrolling when mobile menu is open
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, []);

	if (!mounted) return null;

	const targetNode = container ?? document.body;

	return createPortal(
		<div
			className={cn(
				"fixed inset-x-0 bottom-0 z-50 flex flex-col bg-background",
				className
			)}
			{...props}
		>
			{children}
		</div>,
		targetNode
	);
}

export function PortalBackdrop({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in-0",
				className
			)}
			{...props}
		/>
	);
}