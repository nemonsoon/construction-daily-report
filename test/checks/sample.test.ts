import { describe, expect, it } from "vitest";
import { runChecks } from "../../src/checks/index.ts";
import { readInput } from "../../src/read-input.ts";
import { makeSampleWorkbook } from "../../src/sample-data.ts";
import { roundTrip } from "../helpers.ts";

describe("見本のデータ", () => {
	it("仕込んだ抜けや食い違いを、過不足なく見つける", async () => {
		const { workbook, planted } = makeSampleWorkbook();
		const findings = runChecks(readInput(await roundTrip(workbook)));
		const found = new Set(findings.map((f) => `${f.rowNumber}:${f.column}`));
		const expected = new Set(planted.map((p) => `${p.rowNumber}:${p.column}`));
		expect(found).toEqual(expected);
	});
});
