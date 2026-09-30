import { describe, expect, it } from "vitest";
import { formatClock, workMinutes } from "../src/work-time.ts";

describe("workMinutes", () => {
	it("終了から開始と休憩を引く", () => {
		expect(workMinutes(8 * 60, 17 * 60, 60)).toBe(480);
	});
});

describe("formatClock", () => {
	it.each([
		[480, "8:00"],
		[545, "9:05"],
		[0, "0:00"],
		[1800, "翌6:00"],
		[1440, "翌0:00"],
	])("%i分は %s", (minutes, expected) => {
		expect(formatClock(minutes)).toBe(expected);
	});
});
