import { describe, expect, it } from "vitest";
import { workRow } from "@/features/daily-report/testing/helpers.ts";
import { toCheckedRows } from "./checked-row.ts";

describe("toCheckedRows", () => {
	it("休憩の空欄は0分にする", () => {
		const [row] = toCheckedRows([workRow({ breakMinutes: null })]);
		expect(row.breakMinutes).toBe(0);
	});

	it("必須の列が空なら止まる", () => {
		expect(() => toCheckedRows([workRow({ site: null })])).toThrow(/2行目/);
	});
});
