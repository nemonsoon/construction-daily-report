import type ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { toCheckedRows } from "../src/checked-row.ts";
import { buildDailyReports, sheetName } from "../src/daily-report.ts";
import { workRow } from "./helpers.ts";

describe("sheetName", () => {
	it("現場名をそのまま使う", () => {
		expect(sheetName("山田邸 新築工事", new Set())).toBe("山田邸 新築工事");
	});

	it("シート名に使えない文字を置き換え、31文字で切る", () => {
		const name = sheetName(
			"A/B:C*D?E[F]G\\H 長い現場名がここから続いてずっと続く工事",
			new Set(),
		);
		expect(name).not.toMatch(/[\\/?*:[\]]/);
		expect(name.length).toBeLessThanOrEqual(31);
	});

	it("切った結果が重なれば番号を付ける", () => {
		const used = new Set<string>();
		const long =
			"とても長い現場名がここから続いてずっと続く工事の第一期と第二期";
		const first = sheetName(`${long}1`, used);
		const second = sheetName(`${long}2`, used);
		expect(second).not.toBe(first);
		expect(second).toMatch(/ \(2\)$/);
		expect(second.length).toBeLessThanOrEqual(31);
	});
});

describe("buildDailyReports", () => {
	const rows = toCheckedRows([
		workRow({ rowNumber: 2, date: "2026-09-02", worker: "田中 一郎" }),
		workRow({ rowNumber: 3, worker: "田中 一郎" }),
		workRow({ rowNumber: 4, worker: "佐藤 健", start: 540, work: "配筋" }),
		workRow({
			rowNumber: 5,
			site: "駅前店舗 改装工事",
			weather: "曇",
			worker: "鈴木 大輔",
			start: 22 * 60,
			end: 30 * 60,
			safety: "足場の点検",
		}),
	]);

	function yamada(): ExcelJS.Worksheet {
		const sheet = buildDailyReports(rows).getWorksheet("山田邸 新築工事");
		if (!sheet) throw new Error("山田邸のシートが無い");
		return sheet;
	}

	it("現場ごとに1シートにし、元の日報に出てきた順に並べる", () => {
		const workbook = buildDailyReports(rows);
		expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual([
			"山田邸 新築工事",
			"駅前店舗 改装工事",
		]);
	});

	it("1日分の日報の決まった位置に書く", () => {
		const sheet = yamada();
		expect(sheet.getCell("A1").value).toBe("工事日報");
		expect(sheet.getCell("G1").value).toBe("作成");
		expect(sheet.getCell("H1").value).toBe("確認");
		expect(sheet.getCell("A4").value).toBe("日付");
		expect(sheet.getCell("B4").value).toEqual(new Date(Date.UTC(2026, 8, 1)));
		expect(sheet.getCell("E4").value).toBe("天候");
		expect(sheet.getCell("F4").value).toBe("晴");
		expect(sheet.getCell("A5").value).toBe("現場名");
		expect(sheet.getCell("B5").value).toBe("山田邸 新築工事");
		// 作業内容は F〜H 列を結合しているので、先頭の F 列までを見る
		expect((sheet.getRow(7).values as unknown[]).slice(0, 7)).toEqual([
			undefined,
			"作業員名",
			"開始",
			"終了",
			"休憩(分)",
			"作業時間(時間)",
			"作業内容",
		]);
		expect((sheet.getRow(8).values as unknown[]).slice(0, 7)).toEqual([
			undefined,
			"田中 一郎",
			8 / 24,
			17 / 24,
			60,
			8,
			"基礎の型枠くみたて",
		]);
		expect(sheet.getCell("B9").value).toBe(9 / 24);
		expect(sheet.getCell("F9").value).toBe("配筋");
		expect(sheet.getCell("A10").value).toBe("合計");
		expect(sheet.getCell("B10").value).toBe("2人");
		expect(sheet.getCell("E10").value).toBe(15);
		expect(sheet.getCell("A12").value).toBe("安全");
		expect(sheet.getCell("A15").value).toBe("備考");
	});

	it("日付は年月日と曜日で見せ、翌日の時刻だけ「翌」を付けて見せる", () => {
		const sheet = yamada();
		expect(sheet.getCell("B4").numFmt).toBe('yyyy"年"m"月"d"日"');
		expect(sheet.getCell("D4").value).toBe("（火）");
		expect(sheet.getCell("C8").numFmt).toBe("h:mm");
		const night = buildDailyReports(rows).getWorksheet("駅前店舗 改装工事");
		expect(night?.getCell("B8").numFmt).toBe("h:mm");
		expect(night?.getCell("C8").numFmt).toBe('"翌"h:mm');
	});

	it("日付の順に1日分ずつ並べ、1日ごとに改ページする", () => {
		const sheet = yamada();
		const second = sheet.getColumn(1).values.indexOf("工事日報", 2) as number;
		expect(second).toBeGreaterThan(16);
		expect(sheet.getCell(second + 3, 2).value).toEqual(
			new Date(Date.UTC(2026, 8, 2)),
		);
		// exceljs の型には rowBreaks が無いが、改ページは実行時にここへ積まれる
		const { rowBreaks } = sheet as unknown as { rowBreaks: { id: number }[] };
		expect(rowBreaks.map((pageBreak) => pageBreak.id)).toEqual([second - 1]);
	});

	it("表に罫線を引き、書体を游ゴシックにする", () => {
		const sheet = yamada();
		expect(sheet.getCell("A8").border?.top?.style).toBe("thin");
		expect(sheet.getCell("F8").border?.right?.style).toBe("thin");
		expect(sheet.getCell("G2").border?.bottom?.style).toBe("thin");
		expect(sheet.getCell("A8").font?.name).toBe("游ゴシック");
		expect(sheet.getCell("A1").font?.name).toBe("游ゴシック");
	});

	it("A4 縦で横幅を1ページに収め、足元に現場名とページ番号を出す", () => {
		const sheet = yamada();
		expect(sheet.pageSetup.paperSize).toBe(9);
		expect(sheet.pageSetup.orientation).toBe("portrait");
		expect(sheet.pageSetup.fitToWidth).toBe(1);
		expect(sheet.headerFooter.oddFooter).toContain("&A");
		expect(sheet.headerFooter.oddFooter).toContain("&P");
	});

	it("翌日に終わる作業も作業時間を出す", () => {
		const sheet = buildDailyReports(rows).getWorksheet("駅前店舗 改装工事");
		expect(sheet?.getCell("C8").value).toBe(30 / 24);
		expect(sheet?.getCell("E8").value).toBe(7);
	});
});

describe("buildDailyReports で同じ人が1日に2回来た現場", () => {
	it("行は2つ並べ、人数は1人と数える", () => {
		const rows = toCheckedRows([
			workRow({ rowNumber: 2, start: 480, end: 720, breakMinutes: 0 }),
			workRow({ rowNumber: 3, start: 900, end: 1020, breakMinutes: 0 }),
		]);
		const sheet = buildDailyReports(rows).worksheets[0];
		expect(sheet.getCell("A8").value).toBe("田中 一郎");
		expect(sheet.getCell("A9").value).toBe("田中 一郎");
		expect(sheet.getCell("B10").value).toBe("1人");
		expect(sheet.getCell("E10").value).toBe(6);
	});
});
