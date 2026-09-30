// Numbers の窓の枠を切った版。README では枠つきの元の画像を使う
import dailyReportImage from "../../docs/images/daily-report-sheet.png";
import summaryImage from "../../docs/images/summary-sheet.png";

const SHOTS = [
	{
		src: dailyReportImage,
		width: 980,
		height: 753,
		name: "日報.xlsx",
		note: "現場ごとのシートに1日1ページ。A4 縦で印刷できます",
		alt: "日報.xlsx の1枚。日付・現場名・天候、作業員ごとの時刻と作業時間、人数と合計、作業内容・安全・備考が並ぶ",
	},
	{
		src: summaryImage,
		width: 1070,
		height: 389,
		name: "集計表.xlsx",
		note: "月ごとに現場別と作業員別の延べ人数と作業時間",
		alt: "集計表.xlsx。現場名・月・延べ人数・作業時間の列に、現場ごと・月ごとの数字が並び、最後の行に合計が入る",
	},
];

export function OutputsSection() {
	return (
		<section
			aria-labelledby="outputs-title"
			className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
		>
			<h2
				id="outputs-title"
				className="scroll-mt-24 text-center text-2xl font-bold tracking-tight [word-break:auto-phrase] sm:text-3xl"
			>
				提出用の日報と、月の集計表ができあがります
			</h2>
			<div className="mt-10 grid gap-8 md:grid-cols-2">
				{SHOTS.map(({ src, width, height, name, note, alt }) => (
					<figure key={name} className="flex flex-col">
						{/* 横2列のときは2枚のカードの高さをそろえ、背の低い集計表は上に寄せる */}
						<div className="flex-1 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
							<p className="border-b border-line bg-surface px-4 py-2">
								<span className="rounded-md bg-ink px-2.5 py-0.5 text-xs font-medium text-white">
									{name}
								</span>
							</p>
							{/* 幅と高さを渡し、読み込む前から場所を取って画面がずれないようにする */}
							<img
								src={src}
								width={width}
								height={height}
								alt={alt}
								loading="lazy"
								className="h-auto w-full"
							/>
						</div>
						<figcaption className="mt-3 text-center">
							<span className="text-sm text-muted-foreground">{note}</span>
						</figcaption>
					</figure>
				))}
			</div>
		</section>
	);
}
