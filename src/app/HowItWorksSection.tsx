import {
	ChevronRight,
	FileCheck,
	FileUp,
	type LucideIcon,
	PencilLine,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Cell = { text: string; flagged?: boolean };

// 見本_工事日報.xlsx に仕込んだ書き間違いと同じ名前と値を使う
const INPUT_ROWS: [string, string, string][] = [
	["9/2", "", "8:00"],
	["9/3", "駅前店舗 改装工事", "8時ごろ"],
	["9/4", "駅前店舗 改装工事", "8:00"],
	["9/4", "山田邸 新築工事", "8:00"],
];

// 行-列。空欄の現場名と、読めない開始時刻
const FLAGGED = new Set(["0-1", "1-2"]);

function MiniTable({
	caption,
	headers,
	rows,
	numeric = [],
}: {
	caption: string;
	headers: string[];
	rows: Cell[][];
	numeric?: number[];
}) {
	return (
		<div className="overflow-hidden rounded-lg border border-line bg-white">
			<p className="border-b border-line bg-surface px-2 py-1 text-xs font-bold">
				{caption}
			</p>
			<table className="w-full border-collapse text-left text-xs tabular-nums">
				<thead>
					<tr>
						{headers.map((label, column) => (
							<th
								key={label}
								className={cn(
									"border-b border-line px-2 py-1 font-medium text-muted-foreground",
									numeric.includes(column) && "text-right",
								)}
							>
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, index) => (
						// 同じ中身の行があるので、行の番号を key にする
						// biome-ignore lint/suspicious/noArrayIndexKey: 並びは変わらない
						<tr key={index}>
							{row.map((cell, column) => (
								<td
									// biome-ignore lint/suspicious/noArrayIndexKey: 並びは変わらない
									key={column}
									className={cn(
										"h-7 border-b border-line px-2 whitespace-nowrap",
										numeric.includes(column) && "text-right",
										cell.flagged && "bg-caution",
									)}
								>
									{cell.text}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function InputSheet({ flagged }: { flagged: boolean }) {
	return (
		<MiniTable
			caption={flagged ? "要確認.xlsx" : "工事日報.xlsx"}
			headers={["日付", "現場名", "開始時刻"]}
			rows={INPUT_ROWS.map((row, rowIndex) =>
				row.map((text, column) => ({
					text,
					flagged: flagged && FLAGGED.has(`${rowIndex}-${column}`),
				})),
			)}
		/>
	);
}

function toCells(rows: string[][]): Cell[][] {
	return rows.map((row) => row.map((text) => ({ text })));
}

function Outputs() {
	return (
		<div className="grid gap-3">
			<MiniTable
				caption="日報.xlsx　9/4 駅前店舗 改装工事"
				headers={["作業員名", "開始", "終了", "時間"]}
				numeric={[1, 2, 3]}
				rows={toCells([
					["鈴木 大輔", "8:00", "17:00", "8.00"],
					["高橋 誠", "8:00", "17:00", "8.00"],
				])}
			/>
			<MiniTable
				caption="集計表.xlsx　2026年9月"
				headers={["現場名", "延べ人数", "時間"]}
				numeric={[1, 2]}
				rows={toCells([
					["山田邸 新築工事", "21", "163.00"],
					["駅前店舗 改装工事", "20", "160.00"],
				])}
			/>
		</div>
	);
}

const STEPS: {
	title: string;
	icon: LucideIcon;
	body: string;
	picture: ReactNode;
}[] = [
	{
		title: "読み込む",
		icon: FileUp,
		body: "いつもの日報のExcelを読み込みます",
		picture: <InputSheet flagged={false} />,
	},
	{
		title: "直す",
		icon: PencilLine,
		body: "黄色いセルだけ直して、読み込み直します",
		picture: <InputSheet flagged />,
	},
	{
		title: "できあがる",
		icon: FileCheck,
		body: "提出用の日報と、月の集計表が出てきます",
		picture: <Outputs />,
	},
];

export function HowItWorksSection() {
	return (
		<section aria-labelledby="flow-title" className="bg-surface">
			<div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
				<h2
					id="flow-title"
					className="scroll-mt-24 text-center text-2xl font-bold tracking-tight [word-break:auto-phrase] sm:text-3xl"
				>
					3つの手順で、日報がまとまります
				</h2>
				<ol className="mt-10 grid gap-6 md:grid-cols-3 md:gap-10">
					{STEPS.map(({ title, icon: Icon, body, picture }, index) => (
						<li
							key={title}
							className="relative flex flex-col rounded-2xl border border-line bg-white p-5 shadow-sm"
						>
							<div className="flex items-center gap-3">
								<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
									{index + 1}
								</span>
								<h3 className="text-lg font-bold">{title}</h3>
								<Icon
									aria-hidden
									className="ml-auto size-5 shrink-0 text-muted-foreground"
									strokeWidth={1.75}
								/>
							</div>
							<p className="mt-2 text-sm text-muted-foreground">{body}</p>
							<div aria-hidden className="mt-4">
								{picture}
							</div>
							{index < STEPS.length - 1 && (
								<ChevronRight
									aria-hidden
									className="absolute top-1/2 -right-8 hidden size-6 -translate-y-1/2 text-brand md:block"
								/>
							)}
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
