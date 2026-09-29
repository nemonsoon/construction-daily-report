import { Clock, CopyX, SquareDashed } from "lucide-react";

const CHECKS = [
	{ icon: SquareDashed, title: "空欄", body: "書くべき欄が空いている" },
	{
		icon: Clock,
		title: "時刻の矛盾",
		body: "終了が開始より早いなど、時刻が合わない",
	},
	{
		icon: CopyX,
		title: "食い違い",
		body: "同じ日・同じ現場の行で、内容が合わない",
	},
];

export function ChecksSection() {
	return (
		<section aria-labelledby="checks-title" className="bg-surface">
			<div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
				<h2
					id="checks-title"
					className="scroll-mt-24 text-center text-2xl font-bold tracking-tight [word-break:auto-phrase] sm:text-3xl"
				>
					書き忘れは、まとめる前に分かります
				</h2>
				<ul className="mt-10 grid gap-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
					{CHECKS.map(({ icon: Icon, title, body }) => (
						<li
							key={title}
							className="flex items-center gap-4 md:flex-col md:px-8 md:text-center"
						>
							<Icon
								aria-hidden
								className="size-8 shrink-0 md:size-10"
								strokeWidth={1.5}
							/>
							<div>
								<h3 className="text-lg font-bold">{title}</h3>
								<p className="mt-1 text-muted-foreground">{body}</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
