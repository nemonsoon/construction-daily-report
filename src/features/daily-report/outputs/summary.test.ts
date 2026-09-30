import type ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { workRow } from "@/features/daily-report/testing/helpers.ts";
import { toCheckedRows } from "./checked-row.ts";
import { buildSummaryWorkbook, summarize } from "./summary.ts";

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
	// 同じ日に2つ目の現場へ回った人は、出勤日数では1日と数える
	workRow({
		date: "2026-09-02",
		site: "駅前店舗 改装工事",
		worker: "田中 一郎",
		start: 900,
		end: 1080,
		breakMinutes: 0,
	}),
]);

describe("summarize", () => {
	it("月ごとに、現場別の延べ人数と作業員別の出勤日数と作業時間を足し、元の日報に出てきた順に並べる", () => {
		expect(summarize(rows)).toEqual([
			{
				month: "2026-09",
				from: "2026-09-01",
				to: "2026-09-02",
				sites: [
					{ name: "山田邸 新築工事", count: 2, hours: 14 },
					{ name: "駅前店舗 改装工事", count: 2, hours: 11 },
				],
				workers: [
					{ name: "田中 一郎", count: 2, hours: 17 },
					{ name: "鈴木 大輔", count: 1, hours: 8 },
				],
			},
			{
				month: "2026-10",
				from: "2026-10-01",
				to: "2026-10-01",
				sites: [{ name: "山田邸 新築工事", count: 1, hours: 8 }],
				workers: [{ name: "佐藤 健", count: 1, hours: 8 }],
			},
		]);
	});
});

describe("buildSummaryWorkbook", () => {
	function september(): ExcelJS.Worksheet {
		const sheet = buildSummaryWorkbook(summarize(rows), "2026-09-30")
			.worksheets[0];
		return sheet;
	}

	const firstThree = (sheet: ExcelJS.Worksheet, row: number) =>
		(sheet.getRow(row).values as unknown[]).slice(1, 4);

	it("月ごとに1シートにする", () => {
		const workbook = buildSummaryWorkbook(summarize(rows), "2026-09-30");
		expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual([
			"2026年9月",
			"2026年10月",
		]);
	});

	it("題名、対象の日報の期間、作成日を書く", () => {
		const sheet = september();
		expect(sheet.getCell("A1").value).toBe("2026年9月 工数集計表");
		expect(sheet.getCell("A2").value).toBe("対象の日報");
		expect(sheet.getCell("B2").value).toBe("2026年9月1日〜2026年9月2日");
		expect(sheet.getCell("A3").value).toBe("作成日");
		expect(sheet.getCell("B3").value).toEqual(new Date(Date.UTC(2026, 8, 30)));
		expect(sheet.getCell("B3").numFmt).toBe('yyyy"年"m"月"d"日"');
	});

	it("現場別の表と、数式の合計を書く", () => {
		const sheet = september();
		expect(sheet.getCell("A5").value).toBe("現場別");
		expect(firstThree(sheet, 6)).toEqual([
			"現場名",
			"延べ人数(人)",
			"作業時間(時間)",
		]);
		expect(firstThree(sheet, 7)).toEqual(["山田邸 新築工事", 2, 14]);
		expect(firstThree(sheet, 8)).toEqual(["駅前店舗 改装工事", 2, 11]);
		expect(sheet.getCell("A9").value).toBe("合計");
		expect(sheet.getCell("B9").value).toEqual({
			formula: "SUM(B7:B8)",
			result: 4,
		});
		expect(sheet.getCell("C9").value).toEqual({
			formula: "SUM(C7:C8)",
			result: 25,
		});
	});

	it("作業員別の表と、数式の合計を書く", () => {
		const sheet = september();
		expect(sheet.getCell("A11").value).toBe("作業員別");
		expect(firstThree(sheet, 12)).toEqual([
			"作業員名",
			"出勤日数(日)",
			"作業時間(時間)",
		]);
		expect(firstThree(sheet, 13)).toEqual(["田中 一郎", 2, 17]);
		expect(firstThree(sheet, 14)).toEqual(["鈴木 大輔", 1, 8]);
		expect(sheet.getCell("B15").value).toEqual({
			formula: "SUM(B13:B14)",
			result: 3,
		});
		expect(sheet.getCell("C15").value).toEqual({
			formula: "SUM(C13:C14)",
			result: 25,
		});
	});

	it("罫線と游ゴシックで、A4 縦に収め、足元にページ番号を出す", () => {
		const sheet = september();
		expect(sheet.getCell("A7").border?.top?.style).toBe("thin");
		expect(sheet.getCell("C15").border?.right?.style).toBe("thin");
		expect(sheet.getCell("A7").font?.name).toBe("游ゴシック");
		expect(sheet.getCell("C7").numFmt).toBe("0.00");
		expect(sheet.pageSetup.paperSize).toBe(9);
		expect(sheet.pageSetup.fitToWidth).toBe(1);
		expect(sheet.headerFooter.oddFooter).toContain("&P");
	});
});

describe("summarize で同じ人が1日に2回来た現場", () => {
	it("延べ人数は1人と数え、作業時間は足す", () => {
		const [september] = summarize(
			toCheckedRows([
				workRow({ rowNumber: 2, start: 480, end: 720, breakMinutes: 0 }),
				workRow({ rowNumber: 3, start: 900, end: 1020, breakMinutes: 0 }),
			]),
		);
		expect(september.sites).toEqual([
			{ name: "山田邸 新築工事", count: 1, hours: 6 },
		]);
	});
});
