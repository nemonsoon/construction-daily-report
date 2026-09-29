import { describe, expect, it } from "vitest";
import { InputFormatError, readInput } from "../src/read-input.ts";
import { inputWorkbook, roundTrip } from "./helpers.ts";

const ROW = [
	"2026/9/1",
	"山田邸 新築工事",
	"晴",
	"田中 一郎",
	"8:00",
	"17:00",
	60,
	"基礎の型枠くみたて",
	"",
	"",
];

describe("readInput", () => {
	it("1行を WorkRow にする", () => {
		const [row] = readInput(inputWorkbook([ROW]));
		expect(row).toEqual({
			rowNumber: 2,
			date: "2026-09-01",
			site: "山田邸 新築工事",
			weather: "晴",
			worker: "田中 一郎",
			start: 480,
			end: 1020,
			breakMinutes: 60,
			work: "基礎の型枠くみたて",
			safety: null,
			note: null,
			unreadable: [],
		});
	});

	it("保存し直した日付と時刻のセルを読める", async () => {
		const workbook = inputWorkbook([
			[
				new Date(Date.UTC(2026, 8, 1)),
				"山田邸 新築工事",
				"晴",
				"田中 一郎",
				new Date(Date.UTC(1899, 11, 30, 8)),
				new Date(Date.UTC(1899, 11, 30, 17)),
				60,
				"",
				"",
				"",
			],
		]);
		const sheet = workbook.worksheets[0];
		sheet.getCell("A2").numFmt = "yyyy/m/d";
		sheet.getCell("E2").numFmt = "h:mm";
		sheet.getCell("F2").numFmt = "h:mm";
		const [row] = readInput(await roundTrip(workbook));
		expect(row.date).toBe("2026-09-01");
		expect(row.start).toBe(480);
		expect(row.end).toBe(1020);
	});

	it("見出しの空白・列の順番・余計な列に左右されない", () => {
		const header = [
			" 作業員名 ",
			"指摘",
			"日付",
			"現場名",
			"天候",
			"開始時刻",
			"終了時刻",
			"休憩（分）",
			"作業内容",
			"安全",
			"備考",
		];
		const [row] = readInput(
			inputWorkbook(
				[
					[
						"田中 一郎",
						"前回の指摘",
						"2026/9/1",
						"山田邸 新築工事",
						"晴",
						"8:00",
						"17:00",
						60,
						"",
						"",
						"",
					],
				],
				header,
			),
		);
		expect(row.worker).toBe("田中 一郎");
		expect(row.date).toBe("2026-09-01");
		expect(row.breakMinutes).toBe(60);
	});

	it("見出しが足りなければ、足りない見出しを挙げて止まる", () => {
		const workbook = inputWorkbook([], ["日付", "現場名"]);
		expect(() => readInput(workbook)).toThrow(InputFormatError);
		expect(() => readInput(workbook)).toThrow(/天候/);
	});

	it("空の行は飛ばし、行番号は Excel 上のまま", () => {
		const [first, second] = readInput(inputWorkbook([ROW, [], ROW]));
		expect(first.rowNumber).toBe(2);
		expect(second.rowNumber).toBe(4);
	});

	it("読めない値は null にして列の名前を残す", () => {
		const [row] = readInput(
			inputWorkbook([ROW.map((value, i) => (i === 4 ? "8時ごろ" : value))]),
		);
		expect(row.start).toBeNull();
		expect(row.unreadable).toEqual(["開始時刻"]);
	});
});
