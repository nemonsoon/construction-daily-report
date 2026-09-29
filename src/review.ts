import type ExcelJS from "exceljs";
import { INPUT_COLUMNS, REVIEW_COLUMN } from "./columns.ts";
import type { Finding } from "./finding.ts";
import { ensureColumn, findColumns, setStyle } from "./sheet.ts";

const HIGHLIGHT: ExcelJS.Fill = {
	type: "pattern",
	pattern: "solid",
	fgColor: { argb: "FFFFF2CC" },
};
const NO_FILL: ExcelJS.Fill = { type: "pattern", pattern: "none" };

export function markReview(
	workbook: ExcelJS.Workbook,
	findings: Finding[],
): void {
	const sheet = workbook.worksheets[0];
	const reviewColumn = ensureColumn(sheet, REVIEW_COLUMN, 50);
	const columns = findColumns(sheet);

	for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
		for (const name of INPUT_COLUMNS) {
			setStyle(sheet.getCell(rowNumber, columns.get(name) ?? 0), {
				fill: NO_FILL,
			});
		}
		sheet.getCell(rowNumber, reviewColumn).value = null;
	}

	for (const [rowNumber, list] of Map.groupBy(findings, (f) => f.rowNumber)) {
		for (const finding of list) {
			setStyle(sheet.getCell(rowNumber, columns.get(finding.column) ?? 0), {
				fill: HIGHLIGHT,
			});
		}
		const cell = sheet.getCell(rowNumber, reviewColumn);
		cell.value = list.map((finding) => finding.message).join("\n");
		setStyle(cell, { alignment: { wrapText: true, vertical: "top" } });
	}
}
