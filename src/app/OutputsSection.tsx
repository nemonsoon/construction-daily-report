import dailyReportImage from "../../docs/images/daily-report.png";
import summaryImage from "../../docs/images/summary.png";
import { TryButton } from "./TryButton.tsx";

const SHOTS = [
	{
		src: dailyReportImage,
		name: "日報.xlsx",
		note: "1日・1現場ごとに1枚。A4 縦で印刷できます",
		alt: "日報.xlsx の1枚。日付・現場名・天候、作業員ごとの時刻と作業時間、人数と合計、作業内容・安全・備考が並ぶ",
	},
	{
		src: summaryImage,
		name: "集計表.xlsx",
		note: "現場別・月別の延べ人数と作業時間",
		alt: "集計表.xlsx の画面。現場名・月・延べ人数・作業時間の列に、現場ごと・月ごとの数字が並び、最後の行に合計が入る",
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
				className="text-center text-2xl font-bold tracking-tight sm:text-3xl"
			>
				出てくるもの
			</h2>
			<div className="mt-10 grid gap-8 md:grid-cols-2 md:items-start">
				{SHOTS.map(({ src, name, note, alt }) => (
					<figure key={name}>
						<img
							src={src}
							alt={alt}
							loading="lazy"
							className="w-full rounded-2xl border border-line bg-white shadow-sm"
						/>
						<figcaption className="mt-3 text-center">
							<span className="block font-bold">{name}</span>
							<span className="block text-sm text-muted-foreground">
								{note}
							</span>
						</figcaption>
					</figure>
				))}
			</div>
			<TryButton centered className="mt-12" />
		</section>
	);
}
