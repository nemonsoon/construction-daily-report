import dailyReportImage from "../../docs/images/daily-report.png";
import reviewImage from "../../docs/images/review.png";

const SHOTS = [
	{
		src: reviewImage,
		alt: "要確認.xlsx の画面。直してほしいセルが黄色く塗られ、右端の「指摘」の列に理由が書かれている",
		caption:
			"要確認.xlsx。直してほしいセルが黄色く、右端の「指摘」の列に理由が入ります。",
	},
	{
		src: dailyReportImage,
		alt: "日報.xlsx の1枚。日付・現場名・天候、作業員ごとの時刻と作業時間、人数と合計、作業内容・安全・備考が並ぶ",
		caption:
			"日報.xlsx の1枚。1日・1現場ごとにシートが分かれ、A4 縦で印刷できます。",
	},
];

export function Showcase() {
	return (
		<section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
			<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
				出来上がり
			</h2>
			<div className="mt-10 grid gap-8 md:grid-cols-[1.5fr_1fr]">
				{SHOTS.map(({ src, alt, caption }) => (
					<figure key={src}>
						<img
							src={src}
							alt={alt}
							loading="lazy"
							className="w-full rounded-2xl border border-line bg-white shadow-sm"
						/>
						<figcaption className="mt-3 text-sm text-muted-foreground">
							{caption}
						</figcaption>
					</figure>
				))}
			</div>
		</section>
	);
}
