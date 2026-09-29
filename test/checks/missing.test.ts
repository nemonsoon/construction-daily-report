import { describe, expect, it } from "vitest";
import { checkMissing } from "../../src/checks/missing.ts";
import { workRow } from "../helpers.ts";

describe("checkMissing", () => {
	it("欠けのない行には何も言わない", () => {
		expect(checkMissing([workRow()])).toEqual([]);
	});

	it("必須の列の空欄を指摘する", () => {
		const findings = checkMissing([
			workRow({ rowNumber: 5, site: null, end: null }),
		]);
		expect(findings).toEqual([
			{ rowNumber: 5, column: "現場名", message: "「現場名」が空欄です" },
			{ rowNumber: 5, column: "終了時刻", message: "「終了時刻」が空欄です" },
		]);
	});

	it("読めない値は空欄でなく読めないと言う", () => {
		const findings = checkMissing([
			workRow({ start: null, unreadable: ["開始時刻"] }),
		]);
		expect(findings).toEqual([
			{
				rowNumber: 2,
				column: "開始時刻",
				message: "「開始時刻」の値を読み取れません（例: 8:00）",
			},
		]);
	});

	it("休憩・作業内容・安全・備考の空欄は指摘しない", () => {
		const row = workRow({
			breakMinutes: null,
			work: null,
			safety: null,
			note: null,
		});
		expect(checkMissing([row])).toEqual([]);
	});
});
