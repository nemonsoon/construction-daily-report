import { BrandMark } from "./BrandMark.tsx";
import { APP_HASH } from "./screen.ts";

const REPO = "https://github.com/nemonsoon/construction-daily-report";

// リンク先はページの中の区画と README・ライセンスだけにし、無いページへのリンクは作らない
const COLUMNS = [
	{
		title: "日報まとめ",
		links: [
			{ label: "見本で試す", href: APP_HASH },
			{ label: "使い方の3手順", href: "#flow-title" },
			{ label: "できあがる日報と集計表", href: "#outputs-title" },
			{ label: "見つける書き忘れ", href: "#checks-title" },
			{ label: "よくある質問", href: "#faq-title" },
		],
	},
	{
		title: "使い方",
		links: [
			{ label: "使い方の流れ", href: `${REPO}#使い方` },
			{ label: "入力の Excel の形", href: `${REPO}#入力の-excel-の形` },
			{
				label: "御社の様式に合わせるとき",
				href: `${REPO}#御社の様式に合わせるとき`,
			},
		],
	},
	{
		title: "開発",
		links: [
			{ label: "ソースコード（GitHub）", href: REPO },
			{ label: "手元で動かす", href: `${REPO}#手元で動かす開発者向け` },
			{ label: "ライセンス（MIT）", href: `${REPO}/blob/main/LICENSE` },
		],
	},
];

export function SiteFooter() {
	return (
		<footer className="border-t border-line bg-white [word-break:auto-phrase]">
			<div className="mx-auto grid max-w-6xl gap-10 px-4 pt-14 pb-10 sm:px-6 lg:grid-cols-[1.2fr_2fr]">
				<div>
					<p className="flex items-center gap-2 text-lg font-bold tracking-tight text-brand">
						<BrandMark className="size-7" />
						日報まとめ
					</p>
					<p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
						現場の日報を、提出用の日報と集計表に。
						<br />
						登録不要で、ファイルはブラウザの外に出ません。
					</p>
				</div>
				<nav
					aria-label="サイト内の案内"
					className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3"
				>
					{COLUMNS.map(({ title, links }) => (
						<div key={title}>
							<h2 className="text-sm font-bold">{title}</h2>
							<ul className="mt-2">
								{links.map(({ label, href }) => (
									<li key={label}>
										<a
											href={href}
											className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground"
										>
											{label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</nav>
			</div>
			<div className="border-t border-line">
				<div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
					<p>© 2026 日報まとめ</p>
					<p>見本のファイルは架空のデータです。</p>
				</div>
			</div>
		</footer>
	);
}
