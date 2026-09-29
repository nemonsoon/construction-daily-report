import ExcelJS from "exceljs";
import type { CheckedRow } from "./checked-row.ts";
import { setStyle } from "./sheet.ts";
import { workMinutes } from "./work-time.ts";

export type SummaryLine = {
	site: string;
	month: string;
	workerDays: number;
	hours: number;
};

export function summarize(rows: CheckedRow[]): SummaryLine[] {
	const groups = Map.groupBy(
		rows,
		(row) => `${row.site}\t${row.date.slice(0, 7)}`,
	);
	return [...groups.values()]
		.map((group) => ({
			site: group[0].site,
			month: group[0].date.slice(0, 7),
			workerDays: group.length,
			hours:
				group.reduce(
					(sum, row) => sum + workMinutes(row.start, row.end, row.breakMinutes),
					0,
				) / 60,
		}))
		.sort(
			(a, b) =>
				a.site.localeCompare(b.site, "ja") || a.month.localeCompare(b.month),
		);
}

export function buildSummaryWorkbook(lines: SummaryLine[]): ExcelJS.Workbook {
	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet("現場別・月別", {
		pageSetup: {
			paperSize: 9,
			orientation: "portrait",
			fitToPage: true,
			fitToWidth: 1,
			fitToHeight: 0,
		},
	});
	sheet.columns = [
		{ header: "現場名", key: "site", width: 28 },
		{ header: "月", key: "month", width: 10 },
		{ header: "延べ人数(人)", key: "workerDays", width: 14 },
		{ header: "作業時間(時間)", key: "hours", width: 16 },
	];
	for (const line of lines) sheet.addRow(line);
	const total = sheet.addRow({
		site: "合計",
		workerDays: lines.reduce((sum, line) => sum + line.workerDays, 0),
		hours: lines.reduce((sum, line) => sum + line.hours, 0),
	});
	for (const row of [sheet.getRow(1), total]) {
		row.eachCell((cell) => setStyle(cell, { font: { bold: true } }));
	}
	sheet.getColumn("hours").numFmt = "0.00";
	return workbook;
}
