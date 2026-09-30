// Numbers で開いて表の部分だけを撮った画像。README と同じものを使う
import dailyReportImage from "../../docs/images/daily-report.png";
import summaryImage from "../../docs/images/summary.png";

const SHOTS = [
	{
		src: dailyReportImage,
		width: 1333,
		height: 784,
		name: "日報.xlsx",
		note: "現場ごとのシートに1日1ページ。A4 縦で印刷できます",
		alt: "日報.xlsx の1日分。右上に作成と確認の押印の欄、日付と曜日・天候・現場名、作業員ごとの開始と終了の時刻・休憩・作業時間・作業内容、人数と合計、安全と備考の欄が罫線つきで並ぶ",
	},
	{
		src: summaryImage,
		width: 906,
		height: 721,
		name: "集計表.xlsx",
		note: "月ごとに1シート。現場別の延べ人数と作業員別の出勤日数",
		alt: "集計表.xlsx の2026年9月のシート。題名、対象の日報の期間と作成日の下に、現場別の延べ人数と作業時間の表と、作業員別の出勤日数と作業時間の表が、それぞれ合計の行つきで並ぶ",
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
			{/* 2枚の画像の文字の大きさがそろうよう、カードの幅を画像の横幅の比（1333 : 906）で分ける */}
			<div className="mt-10 grid gap-8 md:grid-cols-[1333fr_906fr]">
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
							<div className="p-3 sm:p-4">
								<img
									src={src}
									width={width}
									height={height}
									alt={alt}
									loading="lazy"
									className="h-auto w-full"
								/>
							</div>
						</div>
						<figcaption className="mt-3 text-center">
							<span className="text-sm text-muted-foreground [word-break:auto-phrase]">
								{note}
							</span>
						</figcaption>
					</figure>
				))}
			</div>
		</section>
	);
}
