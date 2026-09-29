import { cn } from "@/lib/utils";

// 見本_工事日報.xlsx を直してまとめたときに、実際に出てくる値を使う
const WORKERS = [
	["鈴木 大輔", "8:00", "17:00", "60", "8.00"],
	["高橋 誠", "8:00", "17:00", "60", "8.00"],
];

const SITES = [
	["駅前店舗 改装工事", "20", "160.00"],
	["山田邸 新築工事", "21", "163.00"],
	["第二倉庫 屋根補修", "10", "75.00"],
];

const APPEAR =
	"animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-backwards motion-reduce:animate-none";

const CELL = "border border-ink/25 px-1.5 py-1";

function FileLabel({ name }: { name: string }) {
	return (
		<span className="absolute -top-3 left-4 rounded-md bg-ink px-2.5 py-0.5 text-xs font-medium text-white">
			{name}
		</span>
	);
}

function DailyReport() {
	return (
		<div className="relative rounded-lg border border-line bg-white p-4 pt-5 pb-12 shadow-xl sm:p-6 sm:pb-16">
			<FileLabel name="日報.xlsx" />
			<p className="text-center text-base font-bold tracking-widest sm:text-lg">
				工事日報
			</p>
			<table className="mt-3 w-full border-collapse text-[11px] tabular-nums sm:text-sm">
				<tbody>
					<tr>
						<th className={cn(CELL, "w-20 bg-surface text-left font-medium")}>
							日付
						</th>
						<td className={CELL}>2026-09-04</td>
						<th className={cn(CELL, "bg-surface font-medium")}>天候</th>
						<td className={CELL}>雨</td>
					</tr>
					<tr>
						<th className={cn(CELL, "bg-surface text-left font-medium")}>
							現場名
						</th>
						<td className={CELL} colSpan={3}>
							駅前店舗 改装工事
						</td>
					</tr>
				</tbody>
			</table>
			<table className="mt-2 w-full border-collapse text-[11px] tabular-nums sm:text-sm">
				<thead>
					<tr className="bg-surface">
						{["作業員名", "開始", "終了", "休憩(分)", "作業時間"].map(
							(label) => (
								<th key={label} className={cn(CELL, "text-left font-medium")}>
									{label}
								</th>
							),
						)}
					</tr>
				</thead>
				<tbody>
					{WORKERS.map(([name, ...rest]) => (
						<tr key={name}>
							<td className={cn(CELL, "whitespace-nowrap")}>{name}</td>
							{rest.map((value, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: 並びは変わらない
								<td key={index} className={cn(CELL, "text-right")}>
									{value}
								</td>
							))}
						</tr>
					))}
					<tr>
						<td className={CELL}>人数 2人</td>
						<td className={CELL} colSpan={3}>
							<span className="block text-right">合計</span>
						</td>
						<td className={cn(CELL, "text-right font-bold")}>16.00</td>
					</tr>
				</tbody>
			</table>
			<dl className="mt-2 grid grid-cols-[4.5rem_1fr] text-[11px] sm:text-sm">
				<dt className={cn(CELL, "bg-surface font-medium")}>作業内容</dt>
				<dd className={CELL}>天井ボード はり</dd>
				<dt className={cn(CELL, "bg-surface font-medium")}>安全</dt>
				<dd className={CELL}>朝礼で足場の点検をした</dd>
				<dt className={cn(CELL, "bg-surface font-medium")}>備考</dt>
				<dd className={CELL} />
			</dl>
		</div>
	);
}

function Summary() {
	return (
		<div className="relative rounded-lg border border-line bg-white p-4 pt-5 shadow-xl sm:p-5">
			<FileLabel name="集計表.xlsx" />
			<p className="text-center text-sm font-bold tracking-widest sm:text-base">
				集計表　2026年9月
			</p>
			<table className="mt-3 w-full border-collapse text-[11px] tabular-nums sm:text-sm">
				<thead>
					<tr className="bg-surface">
						<th className={cn(CELL, "text-left font-medium")}>現場名</th>
						<th className={cn(CELL, "text-right font-medium")}>延べ人数</th>
						<th className={cn(CELL, "text-right font-medium")}>作業時間</th>
					</tr>
				</thead>
				<tbody>
					{SITES.map(([site, people, hours]) => (
						<tr key={site}>
							<td className={cn(CELL, "whitespace-nowrap")}>{site}</td>
							<td className={cn(CELL, "text-right")}>{people}</td>
							<td className={cn(CELL, "text-right")}>{hours}</td>
						</tr>
					))}
					<tr className="font-bold">
						<td className={CELL}>合計</td>
						<td className={cn(CELL, "text-right")}>51</td>
						<td className={cn(CELL, "text-right")}>398.00</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export function HeroDocuments() {
	return (
		<figure>
			<figcaption className="sr-only">
				できあがる日報.xlsx と集計表.xlsx
				の見本。日報には日付・現場名・天候、作業員ごとの時刻と作業時間、合計、作業内容と安全が並び、集計表には現場ごとの延べ人数と作業時間、合計が並ぶ
			</figcaption>
			<div aria-hidden className="relative pt-3">
				<div className={cn("w-[88%] -rotate-1", APPEAR)}>
					<DailyReport />
				</div>
				<div
					className={cn(
						"relative -mt-10 ml-auto w-[72%] rotate-1 sm:-mt-16",
						APPEAR,
					)}
					style={{ animationDelay: "0.3s" }}
				>
					<Summary />
				</div>
			</div>
		</figure>
	);
}
