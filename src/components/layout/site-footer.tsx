import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark.tsx";
import { LINK } from "@/config/links.ts";
import { SECTION_ID } from "@/config/sections.ts";
import { APP_HASH } from "@/lib/screen.ts";

// リンク先はページの中の区画と GitHub の説明書・ライセンスだけにし、無いページへのリンクは作らない
const COLUMNS = [
	{
		title: "日報まとめ",
		links: [
			{ label: "見本で試す", href: APP_HASH },
			{ label: "使い方の3手順", href: `#${SECTION_ID.flow}` },
			{ label: "できあがる日報と集計表", href: `#${SECTION_ID.outputs}` },
			{ label: "書き忘れのお知らせ", href: `#${SECTION_ID.checks}` },
			{ label: "よくある質問", href: `#${SECTION_ID.faq}` },
		],
	},
	{
		title: "詳しい説明",
		links: [
			{ label: "使い方", href: LINK.usage },
			{ label: "読み込める日報の形", href: LINK.inputFormat },
			{
				label: "様式を合わせるとき",
				href: LINK.customForm,
			},
		],
	},
	{
		title: "開発",
		links: [
			{ label: "ソースコード（GitHub）", href: LINK.repo },
			{
				label: "自分のパソコンで動かす",
				href: LINK.development,
			},
			{ label: "ライセンス（MIT）", href: LINK.license },
		],
	},
];

// アプリの画面では、一周の途中で気を散らさないよう最下段の細い帯だけにする
export function SiteFooter({ compact }: { compact: boolean }) {
	return (
		<footer className="border-t border-line bg-white [word-break:auto-phrase]">
			<div
				hidden={compact}
				className="mx-auto grid max-w-6xl gap-10 px-4 pt-14 pb-10 sm:px-6 lg:grid-cols-[1.2fr_2fr]"
			>
				<div>
					<p className="flex items-center gap-2 text-lg font-bold tracking-tight text-brand">
						<BrandMark className="size-7" />
						日報まとめ
					</p>
					<p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
						現場で書いたExcelを、提出用の日報と集計表に。
						<br />
						登録不要で、ファイルはどこにも送りません。
					</p>
				</div>
				<nav
					aria-label="サイト内の案内"
					className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3"
				>
					{COLUMNS.map(({ title, links }) => (
						// スマートフォン幅では3つ目の列が2行目に1つだけ来るので、横幅いっぱいに広げて文字を折り返させない
						<div key={title} className="last:col-span-2 sm:last:col-span-1">
							<h2 className="text-sm font-bold">{title}</h2>
							<ul className="mt-2">
								{links.map(({ label, href }) => (
									<li key={label}>
										<a
											href={href}
											className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground"
										>
											{/* 折り返しても矢印が文の終わりに付くよう、文字と同じ行の流れに置く */}
											<span>
												{label}
												{href.startsWith("http") && (
													<ArrowUpRight
														aria-hidden
														className="ml-1 inline-block size-3.5 align-[-2px]"
														strokeWidth={1.75}
													/>
												)}
											</span>
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</nav>
			</div>
			<div className={compact ? undefined : "border-t border-line"}>
				<div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
					<p>© 2026 日報まとめ</p>
					<p>見本のファイルは架空のデータです。</p>
				</div>
			</div>
		</footer>
	);
}
