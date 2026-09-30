import { FileSpreadsheet, Globe, LayoutTemplate, Lock } from "lucide-react";
import { SECTION_ID } from "@/config/sections.ts";

// 答えは短く4つだけなので、開いたり閉じたりせず最初から並べて見せる
const FAQS = [
	{
		icon: Globe,
		question: "インストールは要りますか？",
		answer: "要りません。ブラウザで開くだけで使えます。",
	},
	{
		icon: Lock,
		question: "日報のファイルは、どこかに送られますか？",
		answer:
			"送りません。選んだファイルは、そのパソコンのブラウザの中だけで処理します。",
	},
	{
		icon: FileSpreadsheet,
		question: "今お使いの日報でも使えますか？",
		answer:
			"作業員ごとに1行ずつ、日付・現場名・時刻などを書いた表なら使えます。列の並びは問いません。",
	},
	{
		icon: LayoutTemplate,
		question: "様式は変えられますか？",
		answer: "ご依頼に応じて、御社の日報や集計表の様式に合わせて作ります。",
	},
];

export function FaqSection() {
	return (
		<section
			aria-labelledby={SECTION_ID.faq}
			className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
		>
			<h2
				id={SECTION_ID.faq}
				className="scroll-mt-24 text-center text-2xl font-bold tracking-tight [word-break:auto-phrase] sm:text-3xl"
			>
				よくある質問
			</h2>
			<dl className="mt-10 grid gap-x-12 md:grid-cols-2">
				{FAQS.map(({ icon: Icon, question, answer }) => (
					<div
						key={question}
						className="border-t border-line py-6 [word-break:auto-phrase]"
					>
						<dt className="flex items-start gap-2 font-bold">
							<Icon
								aria-hidden
								className="mt-0.5 size-5 shrink-0 text-muted-foreground"
								strokeWidth={1.75}
							/>
							{question}
						</dt>
						<dd className="mt-2 pl-7 leading-relaxed text-muted-foreground">
							{answer}
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
