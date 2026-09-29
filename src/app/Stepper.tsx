import { cn } from "@/lib/utils";
import type { StepMark } from "./flow.ts";
import { StepNumber } from "./StepCard.tsx";

// スマートフォン幅では短い名前にする（3つを横に並べると、長い名前は折り返して読みにくいため）
const LABELS = [
	{ full: "見本の日報を手に入れる", short: "見本を手に入れる" },
	{ full: "日報の Excel を置く", short: "日報を置く" },
	{ full: "直した要確認.xlsx を置く", short: "直したものを置く" },
];

export function Stepper({ marks }: { marks: [StepMark, StepMark, StepMark] }) {
	return (
		<ol
			aria-label="進み具合"
			className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-4"
		>
			{LABELS.map(({ full, short }, index) => {
				const mark = marks[index];
				return (
					<li
						key={full}
						aria-current={mark === "current" ? "step" : undefined}
						className="flex flex-col items-center gap-2 text-center sm:flex-1 sm:flex-row sm:gap-3 sm:text-left sm:last:flex-none"
					>
						<StepNumber number={index + 1} mark={mark} />
						<span
							className={cn(
								"text-sm",
								mark === "current"
									? "font-bold text-brand"
									: "text-muted-foreground",
							)}
						>
							<span className="sm:hidden">{short}</span>
							<span className="hidden sm:inline">{full}</span>
						</span>
						{index < LABELS.length - 1 && (
							<span
								aria-hidden="true"
								className="hidden h-px flex-1 bg-line sm:block"
							/>
						)}
					</li>
				);
			})}
		</ol>
	);
}
