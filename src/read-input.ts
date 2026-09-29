import type ExcelJS from "exceljs";
import { type ColumnName, INPUT_COLUMNS } from "./columns.ts";
import {
	type Parsed,
	parseBreak,
	parseDate,
	parseText,
	parseTime,
} from "./parse.ts";
import { findColumns, plain } from "./sheet.ts";

export type WorkRow = {
	rowNumber: number;
	date: string | null;
	site: string | null;
	weather: string | null;
	worker: string | null;
	start: number | null;
	end: number | null;
	breakMinutes: number | null;
	work: string | null;
	safety: string | null;
	note: string | null;
	unreadable: ColumnName[];
};

export class InputFormatError extends Error {}

export function readInput(workbook: ExcelJS.Workbook): WorkRow[] {
	const sheet = workbook.worksheets[0];
	if (!sheet) throw new InputFormatError("シートがありません");
	const columns = findColumns(sheet);
	const missing = INPUT_COLUMNS.filter((name) => !columns.has(name));
	if (missing.length > 0) {
		throw new InputFormatError(`見出しが見つかりません: ${missing.join("、")}`);
	}

	const rows: WorkRow[] = [];
	for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
		const excelRow = sheet.getRow(rowNumber);
		const raw = (name: ColumnName) =>
			plain(excelRow.getCell(columns.get(name) ?? 0).value);
		if (INPUT_COLUMNS.every((name) => parseText(raw(name)) === null)) continue;

		const unreadable: ColumnName[] = [];
		const take = <T>(name: ColumnName, parsed: Parsed<T>): T | null => {
			if (parsed.kind === "ok") return parsed.value;
			if (parsed.kind === "unreadable") unreadable.push(name);
			return null;
		};
		rows.push({
			rowNumber,
			date: take("日付", parseDate(raw("日付"))),
			site: parseText(raw("現場名")),
			weather: parseText(raw("天候")),
			worker: parseText(raw("作業員名")),
			start: take("開始時刻", parseTime(raw("開始時刻"))),
			end: take("終了時刻", parseTime(raw("終了時刻"))),
			breakMinutes: take("休憩(分)", parseBreak(raw("休憩(分)"))),
			work: parseText(raw("作業内容")),
			safety: parseText(raw("安全")),
			note: parseText(raw("備考")),
			unreadable,
		});
	}
	return rows;
}
