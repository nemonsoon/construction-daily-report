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
});
