import type ExcelJS from "exceljs";
import type { Finding } from "@/features/daily-report/checks/finding.ts";
import {
	ensureColumn,
	setStyle,
	setUpWorkingSheet,
} from "@/features/daily-report/excel/sheet.ts";
import { REVIEW_COLUMN } from "@/features/daily-report/input/columns.ts";
import {
	lastDataRow,
	locateTable,
} from "@/features/daily-report/input/table.ts";

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
	const table = locateTable(workbook);
	const { sheet, headerRow, columns } = table;
	const last = lastDataRow(table);
	const reviewColumn = ensureColumn(sheet, REVIEW_COLUMN, 50, headerRow);

	for (let rowNumber = headerRow + 1; rowNumber <= last; rowNumber++) {
		// 前にかけた指摘の黄色だけを消し、利用者が自分で付けた色は残す
		for (const column of columns.values()) {
			const cell = sheet.getCell(rowNumber, column);
			if (isHighlight(cell)) setStyle(cell, { fill: NO_FILL });
		}
		sheet.getCell(rowNumber, reviewColumn).value = null;
	}

	for (const [rowNumber, list] of Map.groupBy(findings, (f) => f.rowNumber)) {
		for (const finding of list) {
			const column = columns.get(finding.column);
			if (column === undefined) continue;
			setStyle(sheet.getCell(rowNumber, column), { fill: HIGHLIGHT });
		}
		const cell = sheet.getCell(rowNumber, reviewColumn);
		cell.value = list.map((finding) => finding.message).join("\n");
		setStyle(cell, { alignment: { wrapText: true, vertical: "top" } });
	}
	setUpWorkingSheet(
		sheet,
		Math.max(table.lastColumn, reviewColumn),
		last,
		headerRow,
	);
}
