import { SheetDemo } from "./SheetDemo.tsx";
import { HEADING_ID } from "./screen.ts";
import { TryButton } from "./TryButton.tsx";

export function Hero() {
	return (
		<section className="mx-auto grid max-w-6xl gap-8 px-4 pt-10 pb-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-x-12 lg:gap-y-8 lg:pt-20 lg:pb-20">
			<div className="lg:self-end">
				<h1
					id={HEADING_ID.landing}
					tabIndex={-1}
					className="text-4xl font-bold leading-tight tracking-tight outline-none sm:text-5xl"
				>
					日報の書き写しと集計を、Excelのまま
				</h1>
				<p className="mt-5 text-lg leading-relaxed text-muted-foreground">
					書き忘れや食い違いを黄色で知らせ、日報と集計表を作ります。
				</p>
			</div>
			{/* スマートフォン幅では見出しのすぐ下に置き、最初の画面に製品を入れる */}
			<div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
				<SheetDemo />
			</div>
			<TryButton className="lg:self-start" />
		</section>
	);
}
