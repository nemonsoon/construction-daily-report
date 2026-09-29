import { describe, expect, it } from "vitest";
import { INPUT_COLUMNS } from "../src/columns.ts";
import { makeSampleWorkbook } from "../src/sample-data.ts";

describe("makeSampleWorkbook", () => {
	it("見出しと、10日分×5人＋仕込みの2行を持つ", () => {
		const { workbook } = makeSampleWorkbook();
		const sheet = workbook.worksheets[0];
		const header = (sheet.getRow(1).values as unknown[]).slice(1);
		expect(header).toEqual([...INPUT_COLUMNS]);
		expect(sheet.rowCount).toBe(53);
	});

	it("仕込んだ抜けや食い違いは9か所", () => {
		const { planted } = makeSampleWorkbook();
		expect(planted).toHaveLength(9);
	});

	it("どの列も、中身が切れずに見える幅がある", () => {
		const { workbook } = makeSampleWorkbook();
		const sheet = workbook.worksheets[0];
		// Excel の列の幅は半角1文字が1。全角は2で数える
		const textWidth = (text: string) =>
			[...text].reduce((sum, char) => sum + (/[ -~]/.test(char) ? 1 : 2), 0);
		const shown = (value: unknown) =>
			value instanceof Date ? "2026/9/10" : String(value ?? "");
		sheet.getRow(1).eachCell((_, column) => {
			// values は穴のある配列なので、Array.from で穴を undefined にしてから数える
			const values = Array.from(sheet.getColumn(column).values).slice(1);
			const widest = Math.max(
				...values.map((value) => textWidth(shown(value))),
			);
			expect(sheet.getColumn(column).width).toBeGreaterThan(widest);
		});
	});
});
