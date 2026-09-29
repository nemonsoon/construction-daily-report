import { describe, expect, it } from "vitest";
import { markReview } from "../src/review.ts";
import { fillColor, inputWorkbook, roundTrip } from "./helpers.ts";

const ROW = [
	"2026/9/1",
	"山田邸 新築工事",
	"晴",
	"田中 一郎",
	"8:00",
	"17:00",
	60,
	"",
	"",
	"",
];

describe("markReview", () => {
	it("指摘のセルだけに色を付け、指摘の列に文を書く", async () => {
		// 往復させて、読み込んだブックの書式の使い回しが起きる条件にする
		const workbook = await roundTrip(inputWorkbook([ROW, ROW]));
		markReview(workbook, [
			{ rowNumber: 2, column: "現場名", message: "「現場名」が空欄です" },
			{ rowNumber: 2, column: "天候", message: "天候が食い違っています" },
		]);
		const sheet = workbook.worksheets[0];
		expect(fillColor(sheet.getCell("B2"))).toBe("FFFFF2CC");
		expect(fillColor(sheet.getCell("C2"))).toBe("FFFFF2CC");
		expect(fillColor(sheet.getCell("B3"))).toBeUndefined();
		expect(fillColor(sheet.getCell("A2"))).toBeUndefined();
		expect(sheet.getCell("K1").value).toBe("指摘");
		expect(sheet.getCell("K2").value).toBe(
			"「現場名」が空欄です\n天候が食い違っています",
		);
		expect(sheet.getCell("K3").value).toBeNull();
	});

	it("かけ直すと古い色と指摘を消し、指摘の列を増やさない", async () => {
		const workbook = inputWorkbook([ROW]);
		markReview(workbook, [
			{ rowNumber: 2, column: "現場名", message: "空欄です" },
		]);
		const reloaded = await roundTrip(workbook);
		markReview(reloaded, []);
		const sheet = reloaded.worksheets[0];
		expect(fillColor(sheet.getCell("B2"))).toBeUndefined();
		expect(sheet.getCell("K2").value).toBeNull();
		expect(sheet.getCell("L1").value).toBeNull();
	});
});
