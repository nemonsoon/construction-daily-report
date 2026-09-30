import type ExcelJS from "exceljs";
import { type ColumnName, INPUT_COLUMNS } from "./columns.ts";
import { plain } from "./sheet.ts";

export class InputFormatError extends Error {}

// 無いと日報も集計表も作れない列。ほかの列は無ければ空として読む
export const REQUIRED_COLUMNS: readonly ColumnName[] = [
	"日付",
	"現場名",
	"作業員名",
	"開始時刻",
	"終了時刻",
];

// 会社ごとの日報でよく使われる見出しの言い方。空白は無視し、全角と半角の違いもそろえて比べる
const ALIASES: Record<ColumnName, readonly string[]> = {
	日付: ["日付", "年月日", "作業日", "日にち"],
	現場名: ["現場名", "現場", "工事名", "工事件名", "現場名称", "物件名"],
	天候: ["天候", "天気"],
	作業員名: ["作業員名", "作業員", "氏名", "名前", "作業者", "作業者名"],
	開始時刻: ["開始時刻", "開始", "開始時間", "始業", "始業時刻", "作業開始"],
	終了時刻: ["終了時刻", "終了", "終了時間", "終業", "終業時刻", "作業終了"],
	"休憩(分)": ["休憩(分)", "休憩", "休憩時間", "休憩時間(分)"],
	作業内容: ["作業内容", "作業", "内容", "作業の内容"],
	安全: ["安全", "安全事項", "安全確認", "安全指示"],
	備考: ["備考", "メモ", "特記事項"],
};

// 上に題名や会社名の行がある日報でも見出しを見つけられるよう、上から10行までを探す
const HEADER_SEARCH_ROWS = 10;

export type Table = {
	sheet: ExcelJS.Worksheet;
	headerRow: number;
	columns: Map<ColumnName, number>;
	lastColumn: number;
};

export function normalizeHeader(text: string): string {
	return text.normalize("NFKC").replace(/\s/g, "");
}

const LOOKUP = new Map<string, ColumnName>(
	INPUT_COLUMNS.flatMap((name) =>
		ALIASES[name].map((alias) => [normalizeHeader(alias), name] as const),
	),
);

function readHeader(
	sheet: ExcelJS.Worksheet,
	headerRow: number,
): { columns: Map<ColumnName, number>; lastColumn: number } {
	const columns = new Map<ColumnName, number>();
	let lastColumn = 0;
	sheet.getRow(headerRow).eachCell((cell, column) => {
		const text = plain(cell.value);
		if (typeof text !== "string" || text.trim() === "") return;
		lastColumn = column;
		const name = LOOKUP.get(normalizeHeader(text));
		if (name && !columns.has(name)) columns.set(name, column);
	});
	// 決まった順に並べ直しておく
	const ordered = new Map(
		INPUT_COLUMNS.flatMap((name) => {
			const column = columns.get(name);
			return column === undefined ? [] : [[name, column] as const];
		}),
	);
	return { columns: ordered, lastColumn };
}

export function locateTable(workbook: ExcelJS.Workbook): Table {
	let closest: ColumnName[] = [...REQUIRED_COLUMNS];
	for (const sheet of workbook.worksheets) {
		const rows = Math.min(HEADER_SEARCH_ROWS, sheet.rowCount);
		for (let headerRow = 1; headerRow <= rows; headerRow++) {
			const { columns, lastColumn } = readHeader(sheet, headerRow);
			const missing = REQUIRED_COLUMNS.filter((name) => !columns.has(name));
			if (missing.length === 0) {
				return { sheet, headerRow, columns, lastColumn };
			}
			if (missing.length < closest.length) closest = missing;
		}
	}
	throw new InputFormatError(`見出しが見つかりません: ${closest.join("、")}`);
}

// 最後に値のある行。列全体に書式や入力規則がある Excel でも、100万行を回らずに済むよう
// 実際に中身のある行だけを見る
export function lastDataRow(table: Table): number {
	let last = table.headerRow;
	table.sheet.eachRow((row, rowNumber) => {
		if (rowNumber > table.headerRow && row.hasValues) last = rowNumber;
	});
	return last;
}
