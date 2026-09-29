import ExcelJS from "exceljs";
import { INPUT_COLUMNS } from "../src/columns.ts";
import type { WorkRow } from "../src/read-input.ts";
import { loadWorkbook, toBytes } from "../src/sheet.ts";

export function inputWorkbook(
	rows: unknown[][],
	header: readonly string[] = INPUT_COLUMNS,
): ExcelJS.Workbook {
	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet("工事日報");
	sheet.addRow([...header]);
	for (const row of rows) sheet.addRow(row);
	return workbook;
}

// 保存して読み直す。Excel で保存したファイルと同じ条件で確かめるため
export async function roundTrip(
	workbook: ExcelJS.Workbook,
): Promise<ExcelJS.Workbook> {
	return loadWorkbook(await toBytes(workbook));
}

export function workRow(overrides: Partial<WorkRow> = {}): WorkRow {
	return {
		rowNumber: 2,
		date: "2026-09-01",
		site: "山田邸 新築工事",
		weather: "晴",
		worker: "田中 一郎",
		start: 480,
		end: 1020,
		breakMinutes: 60,
		work: "基礎の型枠くみたて",
		safety: null,
		note: null,
		unreadable: [],
		...overrides,
	};
}
