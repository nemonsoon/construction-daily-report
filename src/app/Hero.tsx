import { FlaskConical, MonitorCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetDemo } from "./SheetDemo.tsx";
import { APP_HASH, HEADING_ID } from "./screen.ts";

const PROMISES = [
	{
		icon: MonitorCheck,
		lead: "インストール不要。",
		text: "ブラウザで開くだけで使えます",
	},
	{
		icon: ShieldCheck,
		lead: "選んだファイルは、",
		text: "このブラウザの外に出ません",
	},
	{
		icon: FlaskConical,
		lead: "使っているデータは、",
		text: "すべて架空です",
	},
];

export function Hero() {
	return (
		<section className="mx-auto max-w-6xl px-4 pt-14 pb-16 sm:px-6 lg:pt-20 lg:pb-20">
			<div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
				<div>
					<p className="text-sm font-medium tracking-wide text-muted-foreground">
						建設業の工事日報向けの試作品
					</p>
					<h1
						id={HEADING_ID.landing}
						tabIndex={-1}
						className="mt-4 text-4xl font-bold leading-tight tracking-tight outline-none sm:text-5xl"
					>
						工事日報の書き写しと集計を、いつもの Excel のまま減らす
					</h1>
					<p className="mt-6 max-w-xl text-lg leading-relaxed">
						現場で書いた日報の Excel
						を置くと、書き忘れや食い違いを黄色で知らせます。直したものから、決まった様式の日報と、現場別・月別の集計表を作ります。
					</p>
					<Button asChild size="lg" className="mt-8">
						<a href={APP_HASH}>見本で試す</a>
					</Button>
				</div>
				<SheetDemo />
			</div>
			<ul className="mt-14 grid gap-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
				{PROMISES.map(({ icon: Icon, lead, text }) => (
					<li
						key={lead}
						className="flex items-center gap-4 md:px-8 md:first:pl-0"
					>
						<Icon aria-hidden className="size-7 shrink-0" strokeWidth={1.75} />
						<p className="text-sm leading-relaxed">
							{lead}
							<br />
							{text}
						</p>
					</li>
				))}
			</ul>
		</section>
	);
}
