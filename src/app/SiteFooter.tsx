export function SiteFooter() {
	return (
		<footer className="border-t border-line">
			<div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
				<p>見本のファイルは架空のデータです。</p>
				<p>
					<a
						href="https://github.com/nemonsoon/construction-daily-report"
						className="underline underline-offset-4 hover:text-foreground"
					>
						GitHub で中身を見る
					</a>
					<span className="mx-2">・</span>MIT License
				</p>
			</div>
		</footer>
	);
}
