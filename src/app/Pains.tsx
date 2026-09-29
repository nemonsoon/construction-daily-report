import { ArrowRight } from "lucide-react";

const PAIRS = [
	{
		before: "現場で書いた日報を、決まった様式の日報へ書き写す",
		after: "日報.xlsx を、1日・1現場ごとに1枚のシートで作る",
	},
	{
		before: "現場ごと・月ごとの人数と時間を、集計表へ手で足し上げる",
		after: "集計表.xlsx に、延べ人数と作業時間の合計を出す",
	},
	{
		before: "書き忘れや食い違いに、集計したあとで気付いて直す",
		after: "書き写す前に、直してほしいセルを黄色で知らせる",
	},
];

export function Pains() {
	return (
		<section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
			<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
				減らすのは、書き写しと足し上げの手間
			</h2>
			<div className="mt-10 hidden grid-cols-[1fr_2rem_1fr] gap-4 text-sm font-bold text-muted-foreground md:grid">
				<span>今の手間</span>
				<span />
				<span>このページでは</span>
			</div>
			<ul className="mt-4 space-y-4">
				{PAIRS.map(({ before, after }) => (
					<li
						key={before}
						className="grid items-center gap-2 rounded-xl border border-hogan bg-white p-5 md:grid-cols-[1fr_2rem_1fr] md:gap-4"
					>
						<p className="text-muted-foreground">
							<span className="mr-2 text-xs font-bold md:hidden">今の手間</span>
							{before}
						</p>
						<ArrowRight
							aria-hidden
							className="hidden size-5 text-muted-foreground md:block"
						/>
						<p className="font-medium">
							<span className="mr-2 text-xs font-bold text-muted-foreground md:hidden">
								このページでは
							</span>
							{after}
						</p>
					</li>
				))}
			</ul>
		</section>
	);
}
