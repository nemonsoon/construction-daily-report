import type ExcelJS from "exceljs";
import { type ColumnName, INPUT_COLUMNS } from "./columns.ts";
import {
	type Parsed,
	parseBreak,
	parseDate,
	parseName,
	parseText,
	parseTime,
} from "./parse.ts";
import { plain } from "./sheet.ts";
import { lastDataRow, locateTable } from "./table.ts";

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

export { InputFormatError } from "./table.ts";

export function readInput(workbook: ExcelJS.Workbook): WorkRow[] {
	const table = locateTable(workbook);
	const { sheet, headerRow, columns } = table;
	const last = lastDataRow(table);

	const rows: WorkRow[] = [];
	for (let rowNumber = headerRow + 1; rowNumber <= last; rowNumber++) {
		const excelRow = sheet.getRow(rowNumber);
		// 無い列（天候や備考など）は空として読む
		const raw = (name: ColumnName) => {
			const column = columns.get(name);
			return column === undefined
				? null
				: plain(excelRow.getCell(column).value);
		};
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
			site: parseName(raw("現場名")),
			weather: parseText(raw("天候")),
			worker: parseName(raw("作業員名")),
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
