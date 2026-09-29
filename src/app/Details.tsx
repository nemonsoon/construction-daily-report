import {
	Ban,
	Clock,
	CopyX,
	JapaneseYen,
	LayoutTemplate,
	Moon,
	SquareDashed,
} from "lucide-react";

// 例の文は、検査が実際に出す文と README の例をそのまま使う
const CHECKS = [
	{
		icon: SquareDashed,
		title: "空欄と読めない値",
		body: "日付・現場名・作業員名・開始時刻・終了時刻の空欄と、時刻を「8時ごろ」のように書いたセル。",
		examples: [
			"「現場名」が空欄です",
			"「開始時刻」の値を読み取れません（例: 8:00）",
		],
	},
	{
		icon: Clock,
		title: "時刻の矛盾",
		body: "終了が開始より前の行、休憩が作業時間より長い行、同じ作業員が同じ日に2つの現場で時間が重なる行。",
		examples: [
			"終了時刻が開始時刻と同じか、それより前です",
			"同じ日の9行目（山田邸 新築工事）と時間が重なっています",
		],
	},
	{
		icon: CopyX,
		title: "同じ日・同じ現場の食い違い",
		body: "行ごとに天候が違う場合と、同じ作業員の行が2つある場合（同じ行を2回書き写したときなど）。",
		examples: [
			"同じ日・同じ現場で天候が食い違っています（晴、雨）",
			"同じ日・同じ現場に同じ作業員の行が複数あります（2・7行目）",
		],
	},
];

const FITTING = [
	{
		icon: LayoutTemplate,
		text: "御社の指定の様式（1日1枚の帳票形式の日報や、決まった形の集計表）に合わせて、読み取りと書き出しを作り替えられます。",
	},
	{
		icon: Ban,
		text: "売上の集計（単価の表との突き合わせ）、現場名の表記ゆれの統一、PDF の出力は、この試作品では外しています。",
	},
	{
		icon: Moon,
		text: "日をまたぐ夜間作業は、この試作品では「終了が開始より前」として指摘します。",
	},
	{
		icon: JapaneseYen,
		text: "動かすたびに料金がかかる外部のサービスは使っていません。",
	},
];

export function Details() {
	return (
		<section className="border-t border-line bg-white">
			<div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
				<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
					見つける書き忘れや食い違い
				</h2>
				<p className="mt-3 text-muted-foreground">
					時刻は「8:00」「８：００」「8時30分」のような書き方と、Excel
					の時刻のセルのどちらでも読みます。
				</p>
				<div className="mt-10 grid gap-6 md:grid-cols-3">
					{CHECKS.map(({ icon: Icon, title, body, examples }) => (
						<article
							key={title}
							className="rounded-2xl border border-line bg-surface p-6"
						>
							<Icon aria-hidden className="size-7" strokeWidth={1.75} />
							<h3 className="mt-4 text-lg font-bold">{title}</h3>
							<p className="mt-2 text-sm leading-relaxed">{body}</p>
							<ul className="mt-4 space-y-2 text-xs tabular-nums">
								{examples.map((example) => (
									<li
										key={example}
										className="border-l-4 border-caution bg-white px-3 py-2"
									>
										{example}
									</li>
								))}
							</ul>
						</article>
					))}
				</div>

				<h2 className="mt-20 text-2xl font-bold tracking-tight sm:text-3xl">
					御社の様式に合わせるとき
				</h2>
				<ul className="mt-8 grid max-w-4xl gap-6 leading-relaxed">
					{FITTING.map(({ icon: Icon, text }) => (
						<li key={text} className="flex items-start gap-4">
							<Icon
								aria-hidden
								className="mt-0.5 size-6 shrink-0"
								strokeWidth={1.75}
							/>
							{text}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
