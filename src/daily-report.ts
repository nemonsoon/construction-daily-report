import ExcelJS from "exceljs";
import type { CheckedRow } from "./checked-row.ts";
import { setStyle } from "./sheet.ts";
import { formatClock, workMinutes } from "./work-time.ts";

const INVALID_SHEET_CHARS = /[\\/?*:[\]]/g;
const MAX_SHEET_NAME = 31;
// exceljs の PaperSize は const enum で実行時に値が無いため、A4 の番号を直接書く
const A4 = 9;

export function sheetName(
	date: string,
	site: string,
	used: Set<string>,
): string {
	const base = `${date.slice(5)} ${site}`
		.replace(INVALID_SHEET_CHARS, "_")
		.slice(0, MAX_SHEET_NAME);
	let name = base;
	// Excel のシート名は大文字と小文字を区別せずに重なりを判定する
	for (let n = 2; used.has(name.toLowerCase()); n++) {
		const suffix = ` (${n})`;
		name = base.slice(0, MAX_SHEET_NAME - suffix.length) + suffix;
	}
	used.add(name.toLowerCase());
	return name;
}

function uniqueTexts(values: (string | null)[]): string[] {
	return [
		...new Set(values.filter((value): value is string => value !== null)),
	];
}

export function buildDailyReports(rows: CheckedRow[]): ExcelJS.Workbook {
	const workbook = new ExcelJS.Workbook();
	const used = new Set<string>();
	const groups = Map.groupBy(rows, (row) => `${row.date}\t${row.site}`);
	const keys = [...groups.keys()].sort((a, b) => a.localeCompare(b, "ja"));
	for (const key of keys) {
		const group = groups.get(key) ?? [];
		const sheet = workbook.addWorksheet(
			sheetName(group[0].date, group[0].site, used),
			{
				pageSetup: {
					paperSize: A4,
					orientation: "portrait",
					fitToPage: true,
					fitToWidth: 1,
					fitToHeight: 0,
				},
			},
		);
		writeDailySheet(sheet, group);
	}
	return workbook;
}

function writeDailySheet(sheet: ExcelJS.Worksheet, group: CheckedRow[]): void {
	const { date, site } = group[0];
	sheet.columns = [
		{ width: 16 },
		{ width: 10 },
		{ width: 10 },
		{ width: 10 },
		{ width: 16 },
	];

	sheet.mergeCells("A1:E1");
	const title = sheet.getCell("A1");
	title.value = "工事日報";
	setStyle(title, {
		font: { bold: true, size: 16 },
		alignment: { horizontal: "center" },
	});

	sheet.getRow(3).values = [
		"日付",
		date,
		"",
		"天候",
		uniqueTexts(group.map((row) => row.weather))[0] ?? "",
	];
	sheet.getRow(4).values = ["現場名", site];
	sheet.mergeCells("B4:E4");

	sheet.getRow(6).values = [
		"作業員名",
		"開始",
		"終了",
		"休憩(分)",
		"作業時間(時間)",
	];
	sheet.getRow(6).eachCell((cell) => setStyle(cell, { font: { bold: true } }));

	let rowNumber = 7;
	let totalMinutes = 0;
	for (const row of group) {
		const minutes = workMinutes(row.start, row.end, row.breakMinutes);
		totalMinutes += minutes;
		sheet.getRow(rowNumber).values = [
			row.worker,
			formatClock(row.start),
			formatClock(row.end),
			row.breakMinutes,
			minutes / 60,
		];
		sheet.getCell(rowNumber, 5).numFmt = "0.00";
		rowNumber++;
	}
	sheet.getRow(rowNumber).values = [
		"人数",
		`${group.length}人`,
		"",
		"合計",
		totalMinutes / 60,
	];
	sheet.getCell(rowNumber, 5).numFmt = "0.00";
	rowNumber += 2;

	const sections: [string, string[]][] = [
		[
			"作業内容",
			group.flatMap((row) =>
				row.work === null ? [] : [`${row.worker}: ${row.work}`],
			),
		],
		["安全", uniqueTexts(group.map((row) => row.safety))],
		["備考", uniqueTexts(group.map((row) => row.note))],
	];
	for (const [label, lines] of sections) {
		const labelCell = sheet.getCell(rowNumber, 1);
		labelCell.value = label;
		setStyle(labelCell, { font: { bold: true } });
		sheet.mergeCells(rowNumber + 1, 1, rowNumber + 1, 5);
		const body = sheet.getCell(rowNumber + 1, 1);
		body.value = lines.join("\n");
		setStyle(body, { alignment: { wrapText: true, vertical: "top" } });
		// 結合したセルは Excel が高さを自動で合わせないので、行数から決める
		sheet.getRow(rowNumber + 1).height = Math.max(1, lines.length) * 18;
		rowNumber += 3;
	}
}
