import ExcelJS from "exceljs";

export type RawValue = string | number | Date | null;

// exceljs の型は load に Node の Buffer を求めるが、実行時は ArrayBuffer も Uint8Array も受け付ける
type LoadInput = Parameters<ExcelJS.Workbook["xlsx"]["load"]>[0];

export async function loadWorkbook(
	data: ArrayBuffer | Uint8Array,
): Promise<ExcelJS.Workbook> {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(data as unknown as LoadInput);
	return workbook;
}

const SECONDS_PER_DAY = 86_400;
// 1970-01-01 は Excel の日付の数値で 25569。1904年基準のブックはそこから 1462 日ずれる
const UNIX_EPOCH_SERIAL = 25_569;
const DATE_1904_OFFSET = 1_462;

// exceljs は日時を「ミリ秒 ÷ 1日のミリ秒」で数値にするため、8:00 が 0.33333333333212 のように
// わずかに小さく保存され、LibreOffice などでは 7:59 と表示される。
// 秒の整数を1回だけ割って、Excel で入力したときと同じいちばん近い数値にする
function excelSerial(date: Date, date1904: boolean): number {
	const epoch = UNIX_EPOCH_SERIAL - (date1904 ? DATE_1904_OFFSET : 0);
	const seconds = Math.round(date.getTime() / 1000) + epoch * SECONDS_PER_DAY;
	return seconds / SECONDS_PER_DAY;
}

export async function toBytes(
	workbook: ExcelJS.Workbook,
): Promise<Uint8Array<ArrayBuffer>> {
	const date1904 = workbook.properties.date1904 ?? false;
	const replaced: [ExcelJS.Cell, Date][] = [];
	for (const sheet of workbook.worksheets) {
		sheet.eachRow((row) => {
			row.eachCell((cell) => {
				if (!(cell.value instanceof Date)) return;
				replaced.push([cell, cell.value]);
				if (!cell.numFmt) setStyle(cell, { numFmt: "yyyy/m/d h:mm" });
				cell.value = excelSerial(cell.value, date1904);
			});
		});
	}
	try {
		return new Uint8Array(await workbook.xlsx.writeBuffer());
	} finally {
		// 呼び出し元が同じブックを使い続けても、日時のセルは日時のまま読めるように戻す
		for (const [cell, date] of replaced) cell.value = date;
	}
}

export function plain(value: ExcelJS.CellValue): RawValue {
	if (value === null || value === undefined) return null;
	if (
		value instanceof Date ||
		typeof value === "number" ||
		typeof value === "string"
	) {
		return value;
	}
	if (typeof value === "boolean") return String(value);
	if ("result" in value) return plain(value.result as ExcelJS.CellValue);
	if ("richText" in value)
		return value.richText.map((part) => part.text).join("");
	if ("text" in value) return String(value.text);
	return null;
}

export function findColumns(sheet: ExcelJS.Worksheet): Map<string, number> {
	const columns = new Map<string, number>();
	sheet.getRow(1).eachCell((cell, column) => {
		const text = plain(cell.value);
		if (typeof text !== "string") return;
		const name = text.normalize("NFKC").trim();
		if (name !== "") columns.set(name, column);
	});
	return columns;
}

// exceljs は読み込んだブックの書式オブジェクトを複数のセルで使い回すため、
// cell.fill などへ直接代入すると同じ書式の別のセルまで変わる。必ず新しいオブジェクトに差し替える
export function setStyle(
	cell: ExcelJS.Cell,
	patch: Partial<ExcelJS.Style>,
): void {
	cell.style = { ...cell.style, ...patch };
}

export function ensureColumn(
	sheet: ExcelJS.Worksheet,
	header: string,
	width: number,
): number {
	const columns = findColumns(sheet);
	const existing = columns.get(header);
	if (existing !== undefined) return existing;
	const column = Math.max(0, ...columns.values()) + 1;
	const cell = sheet.getCell(1, column);
	cell.value = header;
	setStyle(cell, { font: { bold: true } });
	sheet.getColumn(column).width = width;
	return column;
}
