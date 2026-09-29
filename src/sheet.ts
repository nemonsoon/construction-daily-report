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

export async function toBytes(
	workbook: ExcelJS.Workbook,
): Promise<Uint8Array<ArrayBuffer>> {
	return new Uint8Array(await workbook.xlsx.writeBuffer());
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
