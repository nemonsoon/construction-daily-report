import { describe, expect, it } from "vitest";
import { loadWorkbook, toBytes } from "@/features/daily-report/excel/sheet.ts";
import { InputFormatError } from "@/features/daily-report/input/read-input.ts";
import { inputWorkbook } from "@/features/daily-report/testing/helpers.ts";
import { runCheck, runReport } from "./pipeline.ts";

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

describe("runReport", () => {
	it("抜けや食い違いが残っていれば書き出さない", async () => {
		const input = await toBytes(
			inputWorkbook([
				["2026/9/1", "", "晴", "田中 一郎", "8:00", "17:00", 60, "", "", ""],
			]),
		);
		const result = await runReport(input);
		expect(result.ok).toBe(false);
	});

	it("通れば日報と集計表を返す", async () => {
		const input = await toBytes(
			inputWorkbook([
				[
					"2026/9/1",
					"山田邸 新築工事",
					"晴",
					"田中 一郎",
					"8:00",
					"17:00",
					60,
					"基礎",
					"",
					"",
				],
			]),
		);
		const result = await runReport(input, "2026-09-30");
		if (!result.ok) throw new Error("通るはずの入力で止まった");
		const daily = await loadWorkbook(result.daily);
		const summary = await loadWorkbook(result.summary);
		expect(daily.worksheets[0].name).toBe("山田邸 新築工事");
		expect(summary.worksheets[0].name).toBe("2026年9月");
		expect(summary.worksheets[0].getCell("B7").value).toBe(1);
		expect(summary.worksheets[0].getCell("B3").value).toEqual(
			new Date(Date.UTC(2026, 8, 30)),
		);
	});
});
