import ExcelJS from "exceljs";
import { INPUT_COLUMNS } from "../src/columns.ts";
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
