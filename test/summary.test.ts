import { describe, expect, it } from "vitest";
import { toCheckedRows } from "../src/checked-row.ts";
import { buildSummaryWorkbook, summarize } from "../src/summary.ts";
import { workRow } from "./helpers.ts";

const rows = toCheckedRows([
	workRow({ date: "2026-09-01", site: "山田邸 新築工事", worker: "田中 一郎" }),
	workRow({
		date: "2026-09-02",
		site: "山田邸 新築工事",
		worker: "田中 一郎",
		end: 900,
	}),
	workRow({ date: "2026-10-01", site: "山田邸 新築工事", worker: "佐藤 健" }),
	workRow({
		date: "2026-09-01",
		site: "駅前店舗 改装工事",
		worker: "鈴木 大輔",
	}),
]);

describe("summarize", () => {
	it("現場別・月別に延べ人数と作業時間を足し、現場名の読みの順・月の順に並べる", () => {
		expect(summarize(rows)).toEqual([
			{ site: "駅前店舗 改装工事", month: "2026-09", workerDays: 1, hours: 8 },
			{ site: "山田邸 新築工事", month: "2026-09", workerDays: 2, hours: 14 },
			{ site: "山田邸 新築工事", month: "2026-10", workerDays: 1, hours: 8 },
		]);
	});
});

describe("buildSummaryWorkbook", () => {
	it("見出し・各行・合計の行を書く", () => {
		const sheet = buildSummaryWorkbook(summarize(rows)).worksheets[0];
		expect(sheet.name).toBe("現場別・月別");
		expect((sheet.getRow(1).values as unknown[]).slice(1)).toEqual([
			"現場名",
			"月",
			"延べ人数(人)",
			"作業時間(時間)",
		]);
		expect((sheet.getRow(2).values as unknown[]).slice(1)).toEqual([
			"駅前店舗 改装工事",
			"2026-09",
			1,
			8,
		]);
		expect((sheet.getRow(5).values as unknown[]).slice(1)).toEqual([
			"合計",
			undefined,
			4,
			30,
		]);
	});
});
