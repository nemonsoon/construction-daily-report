import { describe, expect, it } from "vitest";
import { toBytes } from "../src/sheet.ts";
import { inputWorkbook, sheetXml, storedValue } from "./helpers.ts";

describe("toBytes", () => {
	it("時刻は、Excel で入力したときと同じぴったりの値で保存する", async () => {
		const workbook = inputWorkbook([
			[
				new Date(Date.UTC(2026, 8, 1)),
				"山田邸 新築工事",
				"晴",
				"田中 一郎",
				new Date(Date.UTC(1899, 11, 30, 8)),
				new Date(Date.UTC(1899, 11, 30, 17, 30)),
				60,
				"",
				"",
				"",
			],
		]);

		const xml = sheetXml(await toBytes(workbook));

		expect(storedValue(xml, "A2")).toBe(String(46266));
		expect(storedValue(xml, "E2")).toBe(String(8 / 24));
		expect(storedValue(xml, "F2")).toBe(String(17.5 / 24));
	});

	it("日付と時刻を合わせた値も、ぴったりの値で保存する", async () => {
		const workbook = inputWorkbook([
			[new Date(Date.UTC(2026, 8, 1, 8)), "", "", "", "", "", "", "", "", ""],
		]);

		const xml = sheetXml(await toBytes(workbook));

		// 2026-09-01 8:00 は 46266 と 1/3 日。割り算1回でいちばん近い数値になる
		expect(storedValue(xml, "A2")).toBe(String(138799 / 3));
	});
});
