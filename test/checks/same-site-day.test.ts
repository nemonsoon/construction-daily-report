import { describe, expect, it } from "vitest";
import { checkSameSiteDay } from "../../src/checks/same-site-day.ts";
import { workRow } from "../helpers.ts";

describe("checkSameSiteDay", () => {
	it("天候が行ごとに違えば、天候のある行をすべて指摘する", () => {
		const findings = checkSameSiteDay([
			workRow({ rowNumber: 2, worker: "田中 一郎", weather: "晴" }),
			workRow({ rowNumber: 3, worker: "佐藤 健", weather: "雨" }),
			workRow({ rowNumber: 4, worker: "伊藤 翔", weather: null }),
		]);
		expect(findings).toEqual([
			{
				rowNumber: 2,
				column: "天候",
				message: "同じ日・同じ現場で天候が食い違っています（晴、雨）",
			},
			{
				rowNumber: 3,
				column: "天候",
				message: "同じ日・同じ現場で天候が食い違っています（晴、雨）",
			},
		]);
	});

	it("同じ作業員の行が2つあり時間が重なれば、両方を指摘する", () => {
		const findings = checkSameSiteDay([
			workRow({ rowNumber: 2 }),
			workRow({ rowNumber: 7 }),
		]);
		expect(findings).toEqual([
			{
				rowNumber: 2,
				column: "作業員名",
				message:
					"同じ日・同じ現場に、時間の重なる同じ作業員の行があります（2・7行目）",
			},
			{
				rowNumber: 7,
				column: "作業員名",
				message:
					"同じ日・同じ現場に、時間の重なる同じ作業員の行があります（2・7行目）",
			},
		]);
	});

	it("午前と夕方のように時間が分かれていれば、同じ作業員の行が2つあっても指摘しない", () => {
		const findings = checkSameSiteDay([
			workRow({ rowNumber: 2, start: 480, end: 720, breakMinutes: 0 }),
			workRow({ rowNumber: 5, start: 900, end: 1020, breakMinutes: 0 }),
		]);
		expect(findings).toEqual([]);
	});

	it("日付か現場が違えば比べない", () => {
		const findings = checkSameSiteDay([
			workRow({ rowNumber: 2, weather: "晴" }),
			workRow({ rowNumber: 3, date: "2026-09-02", weather: "雨" }),
		]);
		expect(findings).toEqual([]);
	});
});
