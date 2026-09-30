import { HEADING_ID } from "@/lib/screen.ts";
import { HeroDocuments } from "./hero-documents.tsx";
import { TryButton } from "./try-button.tsx";

export function Hero() {
	return (
		<section className="mx-auto grid max-w-6xl gap-8 px-4 pt-10 pb-14 sm:px-6 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-8 lg:pt-20 lg:pb-20">
			{/* 日本語を語の途中で折り返さない（対応していないブラウザでは今までどおり） */}
			<div className="[word-break:auto-phrase] lg:self-end">
				<p className="mb-3 text-sm font-bold text-brand">
					建設会社の事務の方へ
				</p>
				<h1
					id={HEADING_ID.landing}
					tabIndex={-1}
					className="text-4xl font-bold leading-tight tracking-tight outline-none sm:text-5xl"
				>
					{/* 語の途中で折り返さず、「、」の所で改行させる */}
					<span className="inline-block">現場で書いたExcelを、</span>
					<span className="inline-block">提出用の日報と集計表に</span>
				</h1>
				<p className="mt-5 text-lg leading-relaxed text-muted-foreground">
					読み込むだけで、1日1枚の日報と、月ごとの集計表ができあがります。
					<br />
					書き忘れがあれば、まとめる前にお知らせします。
				</p>
			</div>
			{/* スマートフォン幅では見出しのすぐ下に置き、最初の画面に製品を入れる */}
			<div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
				<HeroDocuments />
			</div>
			<TryButton className="lg:self-start" />
		</section>
	);
}
