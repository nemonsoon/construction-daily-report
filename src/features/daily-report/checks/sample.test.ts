import { describe, expect, it } from "vitest";
import { readInput } from "@/features/daily-report/input/read-input.ts";
import { makeSampleWorkbook } from "@/features/daily-report/sample/sample-data.ts";
import { roundTrip } from "@/features/daily-report/testing/helpers.ts";
import { runChecks } from "./index.ts";

describe("見本のデータ", () => {
	it("仕込んだ抜けや食い違いを、過不足なく見つける", async () => {
		const { workbook, planted } = makeSampleWorkbook();
		const findings = runChecks(readInput(await roundTrip(workbook)));
		const found = new Set(findings.map((f) => `${f.rowNumber}:${f.column}`));
		const expected = new Set(planted.map((p) => `${p.rowNumber}:${p.column}`));
		expect(found).toEqual(expected);
	});
});
