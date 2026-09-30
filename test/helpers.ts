import { inflateRawSync } from "node:zlib";
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

export function fillColor(cell: ExcelJS.Cell): string | undefined {
	const fill = cell.fill as ExcelJS.Fill | undefined;
	return fill?.type === "pattern" && fill.pattern === "solid"
		? fill.fgColor?.argb
		: undefined;
}

// 保存したファイルからシートの XML をそのまま取り出す。
// exceljs で読み直すと数値がミリ秒に丸められ、保存された値のずれが見えなくなるため
export function sheetXml(bytes: Uint8Array, sheetNumber = 1): string {
	const zip = Buffer.from(bytes);
	const name = `xl/worksheets/sheet${sheetNumber}.xml`;
	const end = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
	let entry = zip.readUInt32LE(end + 16);
	for (let i = 0; i < zip.readUInt16LE(end + 10); i++) {
		const nameLength = zip.readUInt16LE(entry + 28);
		const entryName = zip.toString("utf8", entry + 46, entry + 46 + nameLength);
		if (entryName === name) {
			const method = zip.readUInt16LE(entry + 10);
			const size = zip.readUInt32LE(entry + 20);
			const local = zip.readUInt32LE(entry + 42);
			const start =
				local +
				30 +
				zip.readUInt16LE(local + 26) +
				zip.readUInt16LE(local + 28);
			const data = zip.subarray(start, start + size);
			return (method === 0 ? data : inflateRawSync(data)).toString("utf8");
		}
		entry +=
			46 +
			nameLength +
			zip.readUInt16LE(entry + 30) +
			zip.readUInt16LE(entry + 32);
	}
	throw new Error(`${name} がありません`);
}

// シートの XML から、指定したセルに保存された値を文字のまま取り出す
export function storedValue(xml: string, address: string): string | undefined {
	return new RegExp(`<c r="${address}"[^>]*><v>([^<]*)</v>`).exec(xml)?.[1];
}
