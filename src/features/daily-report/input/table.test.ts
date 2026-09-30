import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { inputWorkbook } from "@/features/daily-report/testing/helpers.ts";
import { InputFormatError } from "./read-input.ts";
import { locateTable } from "./table.ts";

const REQUIRED_ONLY = ["日付", "現場名", "作業員名", "開始時刻", "終了時刻"];

describe("locateTable", () => {
	it("1行目の見出しから、決まった名前ごとの列を探す", () => {
		const table = locateTable(inputWorkbook([]));
		expect(table.headerRow).toBe(1);
		expect(table.columns.get("日付")).toBe(1);
		expect(table.columns.get("備考")).toBe(10);
		expect(table.lastColumn).toBe(10);
	});

	it("上に題名の行があっても、10行目までにある見出しを探す", () => {
		const workbook = new ExcelJS.Workbook();
		const sheet = workbook.addWorksheet("9月");
		sheet.getCell("A1").value = "工事日報 2026年9月";
		sheet.getRow(3).values = REQUIRED_ONLY;
		const table = locateTable(workbook);
		expect(table.headerRow).toBe(3);
		expect(table.columns.get("作業員名")).toBe(3);
	});

	it("最初のシートに無ければ、次のシートから探す", () => {
		const workbook = new ExcelJS.Workbook();
		workbook.addWorksheet("表紙").getCell("A1").value = "工事日報";
		workbook.addWorksheet("日報").addRow(REQUIRED_ONLY);
		expect(locateTable(workbook).sheet.name).toBe("日報");
	});

	it("よく使われる別の見出しの名前も受け付ける", () => {
		const table = locateTable(
			inputWorkbook(
				[],
				[
					"作業日",
					"工事名",
					"天気",
					"氏名",
					"始業",
					"終業",
					"休憩時間（分）",
					"作業",
					"安全事項",
					"メモ",
				],
			),
		);
		expect([...table.columns.keys()]).toEqual([
			"日付",
			"現場名",
			"天候",
			"作業員名",
			"開始時刻",
			"終了時刻",
			"休憩(分)",
			"作業内容",
			"安全",
			"備考",
		]);
	});

	it("天候・休憩・作業内容・安全・備考の列は無くてもよい", () => {
		const table = locateTable(inputWorkbook([], REQUIRED_ONLY));
		expect(table.columns.has("天候")).toBe(false);
		expect(table.columns.get("終了時刻")).toBe(5);
	});

	it("必ず要る見出しが無ければ、足りない見出しを挙げて止まる", () => {
		const workbook = inputWorkbook([], ["日付", "現場名"]);
		expect(() => locateTable(workbook)).toThrow(InputFormatError);
		expect(() => locateTable(workbook)).toThrow(/作業員名、開始時刻、終了時刻/);
	});
});
