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
		// 同じ罫線を付けて往復させ、読み込んだブックで書式オブジェクトが使い回される条件にする
		const original = inputWorkbook([ROW, ROW]);
		for (const row of [2, 3]) {
			original.worksheets[0].getRow(row).eachCell((cell) => {
				cell.border = { bottom: { style: "thin" } };
			});
		}
		const workbook = await roundTrip(original);
		const loaded = workbook.worksheets[0];
		expect(loaded.getCell("B2").style).toBe(loaded.getCell("B3").style);
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

	it("見出しの行を固定し、絞り込みを付け、横向きで横幅を1ページに収める", async () => {
		const workbook = inputWorkbook([ROW, ROW]);
		markReview(workbook, []);
		const sheet = workbook.worksheets[0];
		expect(sheet.views).toEqual([{ state: "frozen", xSplit: 0, ySplit: 1 }]);
		expect(sheet.autoFilter).toBe("A1:K3");
		expect(sheet.pageSetup.orientation).toBe("landscape");
		expect(sheet.pageSetup.fitToPage).toBe(true);
		expect(sheet.pageSetup.fitToWidth).toBe(1);
		expect(sheet.pageSetup.fitToHeight).toBe(0);
		expect(sheet.pageSetup.printTitlesRow).toBe("1:1");

		const reloaded = (await roundTrip(workbook)).worksheets[0];
		expect(reloaded.views[0]).toMatchObject({ state: "frozen", ySplit: 1 });
		expect(reloaded.autoFilter).toBe("A1:K3");
	});

	it("利用者が付けた色は残し、日報まとめが付けた黄色だけを消す", async () => {
		const original = inputWorkbook([ROW]);
		original.worksheets[0].getCell("A2").fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "FFC6EFCE" },
		};
		markReview(original, [
			{ rowNumber: 2, column: "現場名", message: "空欄です" },
		]);
		const reloaded = await roundTrip(original);
		markReview(reloaded, []);
		const sheet = reloaded.worksheets[0];
		expect(fillColor(sheet.getCell("A2"))).toBe("FFC6EFCE");
		expect(fillColor(sheet.getCell("B2"))).toBeUndefined();
	});
});
