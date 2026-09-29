import { describe, expect, it } from "vitest";
import { runCheck } from "../src/pipeline.ts";
import { InputFormatError } from "../src/read-input.ts";
import { loadWorkbook, toBytes } from "../src/sheet.ts";
import { inputWorkbook } from "./helpers.ts";

describe("runCheck", () => {
	it("指摘入りの Excel を返し、直したものを読み直すと指摘が消える", async () => {
		const input = await toBytes(
			inputWorkbook([
				["2026/9/1", "", "晴", "田中 一郎", "8:00", "17:00", 60, "", "", ""],
			]),
		);

		const first = await runCheck(input);
		expect(first.findings).toHaveLength(1);

		const review = await loadWorkbook(first.review);
		const sheet = review.worksheets[0];
		expect(sheet.getCell("K2").value).toBe("「現場名」が空欄です");
		sheet.getCell("B2").value = "山田邸 新築工事";

		const second = await runCheck(await toBytes(review));
		expect(second.findings).toEqual([]);
	});

	it("見出しが合わない Excel は InputFormatError で知らせる", async () => {
		const input = await toBytes(inputWorkbook([], ["名前"]));
		await expect(runCheck(input)).rejects.toThrow(InputFormatError);
	});
});
