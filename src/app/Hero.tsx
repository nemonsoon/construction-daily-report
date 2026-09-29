import { FlaskConical, MonitorCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetDemo } from "./SheetDemo.tsx";

const PROMISES = [
	{
		icon: MonitorCheck,
		text: "インストール不要。ブラウザで開くだけで使えます",
	},
	{ icon: ShieldCheck, text: "選んだファイルは、このブラウザの外に出ません" },
	{ icon: FlaskConical, text: "使っているデータは、すべて架空です" },
];

export function Hero() {
	return (
		<header className="mx-auto grid max-w-6xl gap-12 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pt-20 lg:pb-24">
			<div>
				<p className="text-sm font-medium tracking-wide text-muted-foreground">
					建設業の工事日報向けの試作品
				</p>
				<h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
					工事日報の書き写しと集計を、いつもの Excel のまま減らす
				</h1>
				<p className="mt-6 max-w-xl text-lg leading-relaxed">
					現場で書いた日報の Excel
					を置くと、書き忘れや食い違いを黄色で知らせます。直したものから、決まった様式の日報と、現場別・月別の集計表を作ります。
				</p>
				<Button asChild size="lg" className="mt-8">
					<a href="#try">見本で試す</a>
				</Button>
				<ul className="mt-8 space-y-2 text-sm">
					{PROMISES.map(({ icon: Icon, text }) => (
						<li key={text} className="flex items-center gap-2">
							<Icon aria-hidden className="size-4 text-muted-foreground" />
							{text}
						</li>
					))}
				</ul>
			</div>
			<SheetDemo />
		</header>
	);
}
