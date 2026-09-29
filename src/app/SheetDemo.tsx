import { ArrowDown } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Column = "date" | "site" | "worker" | "start" | "end";

type DemoRow = Record<Column, string> & { flagged?: Column };

// 見本_工事日報.xlsx に仕込んだ書き間違いと同じ名前と値を使う
const ROWS: DemoRow[] = [
	{
		date: "9/2",
		site: "山田邸 新築工事",
		worker: "田中 一郎",
		start: "8:00",
		end: "17:00",
	},
	{
		date: "9/2",
		site: "",
		worker: "佐藤 健",
		start: "8:00",
		end: "17:00",
		flagged: "site",
	},
	{
		date: "9/3",
		site: "駅前店舗 改装工事",
		worker: "鈴木 大輔",
		start: "8時ごろ",
		end: "17:00",
		flagged: "start",
	},
	{
		date: "9/4",
		site: "駅前店舗 改装工事",
		worker: "高橋 誠",
		start: "8:00",
		end: "7:00",
		flagged: "end",
	},
];

const HEADERS: [Column, string][] = [
	["date", "日付"],
	["site", "現場名"],
	["worker", "作業員名"],
	["start", "開始時刻"],
	["end", "終了時刻"],
];

const REPORT_ROWS = [
	["鈴木 大輔", "8:00", "17:00", "8.00"],
	["高橋 誠", "8:00", "17:00", "8.00"],
];

function delay(seconds: number): CSSProperties {
	return { animationDelay: `${seconds}s` };
}

const APPEAR =
	"animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards motion-reduce:animate-none";

export function SheetDemo() {
	return (
		<figure className="relative">
			<figcaption className="sr-only">
				工事日報の表で、現場名の空欄・読めない開始時刻・開始より前の終了時刻のセルが黄色く示され、決まった様式の日報に組み上がる見本
			</figcaption>
			<div aria-hidden className="space-y-3">
				<div className="overflow-hidden rounded-xl border border-hogan bg-white shadow-lg">
					<div className="flex items-center gap-2 border-b border-hogan bg-yacho px-3 py-2">
						<span className="rounded-md bg-sumi px-3 py-0.5 text-xs font-medium text-white">
							工事日報
						</span>
						<span className="text-xs text-muted-foreground">
							見本_工事日報.xlsx
						</span>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full font-cell text-xs sm:text-sm">
							<thead>
								<tr className="bg-yacho/60 text-left">
									{HEADERS.map(([key, label]) => (
										<th
											key={key}
											className="border-b border-r border-hogan px-2 py-1.5 font-bold whitespace-nowrap last:border-r-0"
										>
											{label}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{ROWS.map((row, index) => (
									<tr
										key={`${row.date}-${row.worker}`}
										className={APPEAR}
										style={delay(0.2 + index * 0.25)}
									>
										{HEADERS.map(([key]) => (
											<td
												key={key}
												className={cn(
													"border-b border-r border-hogan px-2 py-1.5 whitespace-nowrap last:border-r-0",
													(key === "start" || key === "end") && "text-right",
													row.flagged === key &&
														"animate-flag bg-caution motion-reduce:animate-none",
												)}
												style={
													row.flagged === key
														? delay(1.6 + index * 0.3)
														: undefined
												}
											>
												{row[key]}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<p
						className={cn("px-3 py-2 text-xs text-muted-foreground", APPEAR)}
						style={delay(2.6)}
					>
						<span className="mr-1.5 inline-block size-2.5 rounded-sm bg-caution align-middle" />
						3か所を黄色で知らせる
					</p>
				</div>

				<ArrowDown
					className={cn("mx-auto size-5 text-muted-foreground", APPEAR)}
					style={delay(3.0)}
				/>

				<div
					className={cn(
						"ml-auto w-[88%] rounded-xl border border-hogan bg-white p-4 font-cell text-xs shadow-lg sm:text-sm",
						"animate-in fade-in zoom-in-95 duration-500 fill-mode-backwards motion-reduce:animate-none",
					)}
					style={delay(3.3)}
				>
					<p className="text-center text-base font-bold">工事日報</p>
					<div className="mt-2 flex justify-between gap-2 border-b border-hogan pb-1">
						<span>2026-09-01　駅前店舗 改装工事</span>
						<span className="whitespace-nowrap">天候 晴</span>
					</div>
					<table className="mt-1 w-full">
						<tbody>
							{REPORT_ROWS.map(([worker, start, end, hours]) => (
								<tr key={worker} className="border-b border-hogan">
									<td className="py-1">{worker}</td>
									<td className="text-right">{start}</td>
									<td className="text-right">{end}</td>
									<td className="text-right">{hours}</td>
								</tr>
							))}
							<tr>
								<td className="py-1">人数 2人</td>
								<td />
								<td className="text-right">合計</td>
								<td className="text-right">16.00</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</figure>
	);
}
