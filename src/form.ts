import type ExcelJS from "exceljs";
import { setStyle } from "./sheet.ts";

// 日報と集計表に共通する、印刷する書類としての書式

// exceljs の PaperSize は const enum で実行時に値が無いため、A4 の番号を直接書く
export const A4 = 9;
export const FONT = "游ゴシック";
// 曜日の書式（aaa）や条件つきの書式は、Numbers や macOS のプレビューで読めずにそのまま出るため使わない
export const DATE_FORMAT = 'yyyy"年"m"月"d"日"';
export const HOURS_FORMAT = "0.00";
const THIN: Partial<ExcelJS.Border> = { style: "thin" };
const BOX: Partial<ExcelJS.Borders> = {
	top: THIN,
	left: THIN,
	bottom: THIN,
	right: THIN,
};
const LABEL_FILL: ExcelJS.Fill = {
	type: "pattern",
	pattern: "solid",
	fgColor: { argb: "FFF2F2F2" },
};

export function toDate(isoDate: string): Date {
	return new Date(`${isoDate}T00:00:00Z`);
}

export function japaneseDate(isoDate: string): string {
	const [year, month, day] = isoDate.split("-").map(Number);
	return `${year}年${month}月${day}日`;
}

export type CellStyle = {
	bold?: boolean;
	size?: number;
	border?: boolean;
	label?: boolean;
	align?: ExcelJS.Alignment["horizontal"];
	numFmt?: string;
	wrap?: boolean;
};

export function put(
	sheet: ExcelJS.Worksheet,
	row: number,
	column: number,
	value: ExcelJS.CellValue,
	style: CellStyle = {},
): void {
	const cell = sheet.getCell(row, column);
	cell.value = value;
	setStyle(cell, {
		font: { name: FONT, size: style.size ?? 10.5, bold: style.bold ?? false },
		alignment: {
			vertical: style.wrap ? "top" : "middle",
			horizontal: style.align,
			wrapText: style.wrap ?? false,
		},
		...(style.border || style.label ? { border: BOX } : {}),
		...(style.label ? { fill: LABEL_FILL } : {}),
		...(style.numFmt ? { numFmt: style.numFmt } : {}),
	});
}

// 結合したセルの範囲すべてに罫線を引く。結合しても罫線は各セルに持たせないと途中で切れる
export function merge(
	sheet: ExcelJS.Worksheet,
	row: number,
	from: number,
	to: number,
	value: ExcelJS.CellValue,
	style: CellStyle = {},
): void {
	for (let column = from; column <= to; column++) {
		put(sheet, row, column, column === from ? value : null, style);
	}
	sheet.mergeCells(row, from, row, to);
}
