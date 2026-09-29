import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { StepMark } from "./flow.ts";

type Props = {
	number: number;
	title: string;
	mark: StepMark;
	children: ReactNode;
};

export function StepCard({ number, title, mark, children }: Props) {
	return (
		<li
			aria-current={mark === "current" ? "step" : undefined}
			className="relative grid grid-cols-[2.5rem_1fr] gap-4 sm:gap-6"
		>
			<span
				className={cn(
					"flex size-10 items-center justify-center rounded-full border-2 font-display text-lg",
					mark === "done" && "border-tape bg-tape text-white",
					mark === "current" && "border-sumi bg-sumi text-white",
					mark === "todo" && "border-hogan bg-white text-muted-foreground",
				)}
			>
				{mark === "done" ? (
					<Check aria-label="終わった段" className="size-5" />
				) : (
					number
				)}
			</span>
			<div
				className={cn(
					"rounded-xl border bg-card p-5 shadow-sm sm:p-6",
					mark === "current" ? "border-sumi/30" : "border-hogan",
				)}
			>
				<h3 className="text-lg font-bold">{title}</h3>
				<div className="mt-2 space-y-3 leading-relaxed">{children}</div>
			</div>
		</li>
	);
}
