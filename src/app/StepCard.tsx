import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { StepMark } from "./flow.ts";

export function StepNumber({
	number,
	mark,
}: {
	number: number;
	mark: StepMark;
}) {
	return (
		<span
			className={cn(
				"flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-lg font-bold tabular-nums",
				mark === "done" && "border-tape bg-tape text-white",
				mark === "current" && "border-brand bg-brand text-white",
				mark === "todo" && "border-line bg-white text-muted-foreground",
			)}
		>
			{mark === "done" ? (
				<Check aria-label="終わった段" className="size-5" />
			) : (
				number
			)}
		</span>
	);
}

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
			className={cn(
				"rounded-2xl border bg-white p-5 shadow-sm sm:p-7",
				mark === "current" ? "border-brand/40" : "border-line",
			)}
		>
			<div className="flex items-center gap-3">
				<StepNumber number={number} mark={mark} />
				<h2 className="text-lg font-bold sm:text-xl">{title}</h2>
			</div>
			<div className="mt-4 space-y-4 leading-relaxed">{children}</div>
		</li>
	);
}
