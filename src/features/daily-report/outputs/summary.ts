import ExcelJS from "exceljs";
import {
	A4,
	DATE_FORMAT,
	HOURS_FORMAT,
	japaneseDate,
	merge,
	put,
	toDate,
} from "@/features/daily-report/excel/form.ts";
import { type CheckedRow, inSheetOrder } from "./checked-row.ts";
import { workMinutes } from "./work-time.ts";

// 現場別では延べ人数、作業員別では出勤日数を count に持つ
export type Tally = { name: string; count: number; hours: number };

export type MonthSummary = {
	month: string;
	from: string;
	to: string;
	sites: Tally[];
	workers: Tally[];
};

function hoursOf(rows: CheckedRow[]): number {
	return (
		rows.reduce(
			(sum, row) => sum + workMinutes(row.start, row.end, row.breakMinutes),
			0,
		) / 60
	);
}

function tally(
	rows: CheckedRow[],
	nameOf: (row: CheckedRow) => string,
	countOf: (group: CheckedRow[]) => number,
): Tally[] {
	return [...Map.groupBy(inSheetOrder(rows), nameOf)].map(([name, group]) => ({
		name,
		count: countOf(group),
		hours: hoursOf(group),
	}));
}

export function summarize(rows: CheckedRow[]): MonthSummary[] {
	return [...Map.groupBy(rows, (row) => row.date.slice(0, 7))]
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([month, group]) => {
			const dates = group.map((row) => row.date).sort();
			return {
				month,
				from: dates[0],
				to: dates[dates.length - 1],
				// 延べ人数は日ごとの人数の合計。同じ日に2回来た人は1人と数える
				sites: tally(
					group,
					(row) => row.site,
					(lines) =>
						new Set(lines.map((row) => `${row.date}\t${row.worker}`)).size,
				),
				// 同じ日に2つの現場へ回った人も、出勤日数では1日と数える
				workers: tally(
					group,
					(row) => row.worker,
					(lines) => new Set(lines.map((row) => row.date)).size,
				),
			};
		});
}

function monthLabel(month: string): string {
	const [year, number] = month.split("-").map(Number);
	return `${year}年${number}月`;
}

// 月ごとに1シートにし、月末にその月の分を1枚で提出できるようにする
export function buildSummaryWorkbook(
	months: MonthSummary[],
	createdOn: string,
): ExcelJS.Workbook {
	const workbook = new ExcelJS.Workbook();
	for (const summary of months) {
		const label = monthLabel(summary.month);
		const sheet = workbook.addWorksheet(label, {
			pageSetup: {
				paperSize: A4,
				orientation: "portrait",
				fitToPage: true,
				fitToWidth: 1,
				fitToHeight: 0,
				horizontalCentered: true,
			},
			headerFooter: { oddFooter: "&L&A&R&P / &N ページ" },
		});
		sheet.columns = [{ width: 30 }, { width: 14 }, { width: 16 }];

		merge(sheet, 1, 1, 3, `${label} 工数集計表`, { bold: true, size: 16 });
		put(sheet, 2, 1, "対象の日報", { label: true });
		merge(
			sheet,
			2,
			2,
			3,
			`${japaneseDate(summary.from)}〜${japaneseDate(summary.to)}`,
			{ border: true },
		);
		put(sheet, 3, 1, "作成日", { label: true });
		merge(sheet, 3, 2, 3, toDate(createdOn), {
			border: true,
			align: "left",
			numFmt: DATE_FORMAT,
		});

		const next = writeTable(
			sheet,
			5,
			"現場別",
			"現場名",
			"延べ人数(人)",
			summary.sites,
		);
		writeTable(
			sheet,
			next + 2,
			"作業員別",
			"作業員名",
			"出勤日数(日)",
			summary.workers,
		);
	}
	return workbook;
}

// top の行に表の名前を書き、その下に見出し・各行・合計を書いて、合計の行の番号を返す
function writeTable(
	sheet: ExcelJS.Worksheet,
	top: number,
	title: string,
	nameHeader: string,
	countHeader: string,
	tallies: Tally[],
): number {
	put(sheet, top, 1, title, { bold: true });
	[nameHeader, countHeader, "作業時間(時間)"].forEach((header, index) => {
		put(sheet, top + 1, index + 1, header, { label: true, align: "center" });
	});
	const first = top + 2;
	tallies.forEach((line, index) => {
		const row = first + index;
		put(sheet, row, 1, line.name, { border: true });
		put(sheet, row, 2, line.count, { border: true });
		put(sheet, row, 3, line.hours, { border: true, numFmt: HOURS_FORMAT });
	});
	const last = first + tallies.length - 1;
	const total = last + 1;
	// 利用者が表の数字を手で直しても合計がそろうよう数式にし、開いてすぐ見えるよう結果も持たせる
	const sum = (column: string, result: number): ExcelJS.CellFormulaValue => ({
		formula: `SUM(${column}${first}:${column}${last})`,
		result,
	});
	put(sheet, total, 1, "合計", { label: true, bold: true });
	put(
		sheet,
		total,
		2,
		sum(
			"B",
			tallies.reduce((acc, line) => acc + line.count, 0),
		),
		{ border: true, bold: true },
	);
	put(
		sheet,
		total,
		3,
		sum(
			"C",
			tallies.reduce((acc, line) => acc + line.hours, 0),
		),
		{ border: true, bold: true, numFmt: HOURS_FORMAT },
	);
	return total;
}
