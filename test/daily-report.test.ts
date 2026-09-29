import { describe, expect, it } from "vitest";
import { toCheckedRows } from "../src/checked-row.ts";
import { buildDailyReports, sheetName } from "../src/daily-report.ts";
import { workRow } from "./helpers.ts";

describe("sheetName", () => {
	it("月日と現場名をつなぐ", () => {
		expect(sheetName("2026-09-01", "山田邸 新築工事", new Set())).toBe(
			"09-01 山田邸 新築工事",
		);
	});

	it("シート名に使えない文字を置き換え、31文字で切る", () => {
		const name = sheetName(
			"2026-09-01",
			"A/B:C*D?E[F]G\\H 長い現場名がここから続いてずっと続く工事",
			new Set(),
		);
		expect(name).not.toMatch(/[\\/?*:[\]]/);
		expect(name.length).toBeLessThanOrEqual(31);
	});

	it("切った結果が重なれば番号を付ける", () => {
		const used = new Set<string>();
		const long = "とても長い現場名がここから続いてずっと続く工事の第一期";
		const first = sheetName("2026-09-01", `${long}1`, used);
		const second = sheetName("2026-09-01", `${long}2`, used);
		expect(second).not.toBe(first);
		expect(second).toMatch(/ \(2\)$/);
		expect(second.length).toBeLessThanOrEqual(31);
	});
});

describe("buildDailyReports", () => {
	const rows = toCheckedRows([
		workRow({ rowNumber: 2, worker: "田中 一郎" }),
		workRow({ rowNumber: 3, worker: "佐藤 健", start: 540, work: "配筋" }),
		workRow({
			rowNumber: 4,
			site: "駅前店舗 改装工事",
			weather: "曇",
			worker: "鈴木 大輔",
			safety: "足場の点検",
		}),
	]);

	it("1日×1現場で1シートにし、日付と現場名の読みの順に並べる", () => {
		const workbook = buildDailyReports(rows);
		expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual([
			"09-01 駅前店舗 改装工事",
			"09-01 山田邸 新築工事",
		]);
	});

	it("様式の決まった位置に書く", () => {
		const sheet = buildDailyReports(rows).getWorksheet("09-01 山田邸 新築工事");
		if (!sheet) throw new Error("山田邸のシートが無い");
		expect(sheet.getCell("A1").value).toBe("工事日報");
		expect(sheet.getCell("B3").value).toBe("2026-09-01");
		expect(sheet.getCell("E3").value).toBe("晴");
		expect(sheet.getCell("B4").value).toBe("山田邸 新築工事");
		expect(sheet.getCell("A7").value).toBe("田中 一郎");
		expect(sheet.getCell("B7").value).toBe("8:00");
		expect(sheet.getCell("E7").value).toBe(8);
		expect(sheet.getCell("B8").value).toBe("9:00");
		expect(sheet.getCell("E8").value).toBe(7);
		expect(sheet.getCell("B9").value).toBe("2人");
		expect(sheet.getCell("E9").value).toBe(15);
		expect(sheet.getCell("A11").value).toBe("作業内容");
		expect(sheet.getCell("A12").value).toBe(
			"田中 一郎: 基礎の型枠くみたて\n佐藤 健: 配筋",
		);
	});

	it("A4 縦で横幅を1ページに収める印刷設定にする", () => {
		const sheet = buildDailyReports(rows).worksheets[0];
		expect(sheet.pageSetup.paperSize).toBe(9);
		expect(sheet.pageSetup.fitToWidth).toBe(1);
	});
});
