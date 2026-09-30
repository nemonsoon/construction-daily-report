import { describe, expect, it } from "vitest";
import { parseBreak, parseDate, parseText, parseTime } from "./parse.ts";

describe("parseDate", () => {
	it.each([
		[new Date(Date.UTC(2026, 8, 1)), "2026-09-01"],
		["2026/9/1", "2026-09-01"],
		["2026-09-01", "2026-09-01"],
		["2026年9月1日", "2026-09-01"],
		["２０２６/９/１", "2026-09-01"],
		[46266, "2026-09-01"],
		["令和8年9月1日", "2026-09-01"],
		["R8.9.1", "2026-09-01"],
		["r8/9/1", "2026-09-01"],
		["令和元年5月1日", "2019-05-01"],
		["平成31年4月30日", "2019-04-30"],
		["H30.1.5", "2018-01-05"],
		["2026/9/1（火）", "2026-09-01"],
		["2026/9/1 (火)", "2026-09-01"],
	])("%s は %s", (raw, expected) => {
		expect(parseDate(raw)).toEqual({ kind: "ok", value: expected });
	});

	it.each([[null], [""], ["  "]])("%j は空欄", (raw) => {
		expect(parseDate(raw)).toEqual({ kind: "blank" });
	});

	it.each([["9月1日"], ["9/1"], ["2026/2/30"], ["令和8年2月30日"], ["きのう"]])(
		"%s は読めない",
		(raw) => {
			expect(parseDate(raw)).toEqual({ kind: "unreadable" });
		},
	);

	it.each([
		[20260901],
		[1],
		["1999/12/31"],
		["2101/1/1"],
		[new Date(Date.UTC(1899, 11, 30, 8))],
	])("2000〜2100年の外の %s は読めない", (raw) => {
		expect(parseDate(raw)).toEqual({ kind: "unreadable" });
	});
});

describe("parseTime", () => {
	it.each([
		[new Date(Date.UTC(1899, 11, 30, 8, 0)), 480],
		["8:00", 480],
		["８：００", 480],
		["8時", 480],
		["8時30分", 510],
		["8:00:00", 480],
		["17:30:59", 1050],
		[0.5, 720],
		["翌6:00", 1800],
		["翌6時30分", 1830],
		["30:00", 1800],
		["24:00", 1440],
		[1.25, 1800],
		[new Date(Date.UTC(1899, 11, 31, 6, 0)), 1800],
	])("%s は %i分", (raw, expected) => {
		expect(parseTime(raw)).toEqual({ kind: "ok", value: expected });
	});

	it.each([["8時ごろ"], ["48:00"], ["翌25:00"], ["8:75"], [2.5]])(
		"%s は読めない",
		(raw) => {
			expect(parseTime(raw)).toEqual({ kind: "unreadable" });
		},
	);
});

describe("parseBreak", () => {
	it.each([
		[60, 60],
		["60", 60],
		["60分", 60],
		["６０", 60],
	])("%s は %i分", (raw, expected) => {
		expect(parseBreak(raw)).toEqual({ kind: "ok", value: expected });
	});

	it("「1時間」は読めない", () => {
		expect(parseBreak("1時間")).toEqual({ kind: "unreadable" });
	});
});

describe("parseText", () => {
	it("前後の空白を落とし、空なら null", () => {
		expect(parseText("  基礎  ")).toBe("基礎");
		expect(parseText("   ")).toBeNull();
		expect(parseText(null)).toBeNull();
	});
});
