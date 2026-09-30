import { describe, expect, it } from "vitest";
import { checkTimes } from "../../src/checks/times.ts";
import { workRow } from "../helpers.ts";

describe("checkTimes", () => {
	it("問題のない行には何も言わない", () => {
		expect(checkTimes([workRow()])).toEqual([]);
	});

	it("終了が開始と同じか前なら、夜の作業の書き方を添えて指摘する", () => {
		expect(checkTimes([workRow({ end: 420 })])).toEqual([
			{
				rowNumber: 2,
				column: "終了時刻",
				message:
					"終了時刻が開始時刻と同じか、それより前です（夜の作業なら「翌6:00」のように書いてください）",
			},
		]);
	});

	it("翌日に終わる夜の作業は指摘しない", () => {
		expect(
			checkTimes([workRow({ start: 22 * 60, end: 24 * 60 + 6 * 60 })]),
		).toEqual([]);
	});

	it("休憩が作業時間以上なら指摘する", () => {
		expect(
			checkTimes([workRow({ start: 480, end: 540, breakMinutes: 60 })]),
		).toEqual([
			{
				rowNumber: 2,
				column: "休憩(分)",
				message: "休憩が作業時間と同じか、それより長いです",
			},
		]);
	});

	it("同じ人が同じ日に別の現場で時間が重なれば、両方の行を指摘する", () => {
		const findings = checkTimes([
			workRow({ rowNumber: 2, site: "第二倉庫 屋根補修", worker: "伊藤 翔" }),
			workRow({
				rowNumber: 9,
				site: "山田邸 新築工事",
				worker: "伊藤 翔",
				start: 780,
			}),
		]);
		expect(findings).toEqual([
			{
				rowNumber: 2,
				column: "開始時刻",
				message: "同じ日の9行目（山田邸 新築工事）と時間が重なっています",
			},
			{
				rowNumber: 9,
				column: "開始時刻",
				message: "同じ日の2行目（第二倉庫 屋根補修）と時間が重なっています",
			},
		]);
	});

	it("午前と午後で現場を移るのは重なりではない", () => {
		const findings = checkTimes([
			workRow({
				rowNumber: 2,
				site: "第二倉庫 屋根補修",
				end: 720,
				breakMinutes: 0,
			}),
			workRow({
				rowNumber: 3,
				site: "山田邸 新築工事",
				start: 720,
				breakMinutes: 0,
			}),
		]);
		expect(findings).toEqual([]);
	});
});
