import { Check, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { StepMark } from "./flow.ts";

type Props = {
	number: number;
	title: string;
	icon: LucideIcon;
	mark: StepMark;
	last?: boolean;
	children: ReactNode;
};

export function StepCard({
	number,
	title,
	icon: Icon,
	mark,
	last = false,
	children,
}: Props) {
	return (
		<li
			aria-current={mark === "current" ? "step" : undefined}
			className="relative grid grid-cols-[2.5rem_1fr] gap-4 sm:gap-6"
		>
			{!last && (
				// 番号の丸の下から次の段の丸までを点線でつなぐ（ol の space-y-6 の分だけ下へ伸ばす）
				<span
					aria-hidden
					className="absolute top-12 -bottom-4 left-5 border-l-2 border-dashed border-line"
				/>
			)}
			<span
				className={cn(
					"relative flex size-10 items-center justify-center rounded-full border-2 text-lg font-bold tabular-nums",
					mark === "done" && "border-tape bg-tape text-white",
					mark === "current" && "border-ink bg-ink text-white",
					mark === "todo" && "border-line bg-white text-muted-foreground",
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
					"flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:flex-row sm:gap-6 sm:p-7",
					mark === "current" ? "border-ink/30" : "border-line",
				)}
			>
				<Icon aria-hidden className="size-7 shrink-0" strokeWidth={1.75} />
				<div className="min-w-0 flex-1">
					<h3 className="text-lg font-bold">{title}</h3>
					<div className="mt-2 space-y-4 leading-relaxed">{children}</div>
				</div>
			</div>
		</li>
	);
}
