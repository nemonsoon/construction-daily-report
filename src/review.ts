import type ExcelJS from "exceljs";
import { INPUT_COLUMNS, REVIEW_COLUMN } from "./columns.ts";
import type { Finding } from "./finding.ts";
import {
	ensureColumn,
	findColumns,
	setStyle,
	setUpWorkingSheet,
} from "./sheet.ts";

const HIGHLIGHT_COLOR = "FFFFF2CC";
const HIGHLIGHT: ExcelJS.Fill = {
	type: "pattern",
	pattern: "solid",
	fgColor: { argb: HIGHLIGHT_COLOR },
};

function isHighlight(cell: ExcelJS.Cell): boolean {
	const fill = cell.fill as ExcelJS.Fill | undefined;
	return fill?.type === "pattern" && fill.fgColor?.argb === HIGHLIGHT_COLOR;
}
const NO_FILL: ExcelJS.Fill = { type: "pattern", pattern: "none" };

export function markReview(
	workbook: ExcelJS.Workbook,
	findings: Finding[],
): void {
	const sheet = workbook.worksheets[0];
	const reviewColumn = ensureColumn(sheet, REVIEW_COLUMN, 50);
	const columns = findColumns(sheet);

	for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
		// 前にかけた指摘の黄色だけを消し、利用者が自分で付けた色は残す
		for (const name of INPUT_COLUMNS) {
			const cell = sheet.getCell(rowNumber, columns.get(name) ?? 0);
			if (isHighlight(cell)) setStyle(cell, { fill: NO_FILL });
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
	setUpWorkingSheet(sheet, reviewColumn);
}
