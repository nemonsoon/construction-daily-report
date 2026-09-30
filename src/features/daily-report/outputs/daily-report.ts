import ExcelJS from "exceljs";
import {
	A4,
	DATE_FORMAT,
	HOURS_FORMAT,
	merge,
	put,
	toDate,
} from "@/features/daily-report/excel/form.ts";
import { type CheckedRow, inSheetOrder } from "./checked-row.ts";
import { workMinutes } from "./work-time.ts";

const INVALID_SHEET_CHARS = /[\\/?*:[\]]/g;
const MAX_SHEET_NAME = 31;
const MINUTES_PER_DAY = 1440;
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
// h は日を数えず時だけを出すので、1日を超える値（30:00）も「翌6:00」になる。
// 条件つきの書式は Numbers などで読めないため、翌日の時刻のセルだけ「翌」を付けた書式にする
function clockFormat(minutes: number): string {
	return minutes >= MINUTES_PER_DAY ? '"翌"h:mm' : "h:mm";
}

export function sheetName(site: string, used: Set<string>): string {
	const base = site.replace(INVALID_SHEET_CHARS, "_").slice(0, MAX_SHEET_NAME);
	let name = base;
	// Excel のシート名は大文字と小文字を区別せずに重なりを判定する
	for (let n = 2; used.has(name.toLowerCase()); n++) {
		const suffix = ` (${n})`;
		name = base.slice(0, MAX_SHEET_NAME - suffix.length) + suffix;
	}
	used.add(name.toLowerCase());
	return name;
}

function uniqueTexts(values: (string | null)[]): string[] {
	return [
		...new Set(values.filter((value): value is string => value !== null)),
	];
}

// 1現場を1シートにし、その中に1日分ずつ日付の順に並べて、1日ごとに改ページする。
// 1日と1現場ごとにシートを分けると、1か月分でシートが数十枚になり探しにくいため
export function buildDailyReports(rows: CheckedRow[]): ExcelJS.Workbook {
	const workbook = new ExcelJS.Workbook();
	const used = new Set<string>();
	const bySite = Map.groupBy(inSheetOrder(rows), (row) => row.site);
	const sites = [...bySite.keys()];
	for (const site of sites) {
		const sheet = workbook.addWorksheet(sheetName(site, used), {
			pageSetup: {
				paperSize: A4,
				orientation: "portrait",
				fitToPage: true,
				fitToWidth: 1,
				fitToHeight: 0,
				horizontalCentered: true,
			},
			headerFooter: { oddFooter: "&L&A&R&P / &N ページ" },
		});
		sheet.columns = [
			{ width: 14 },
			{ width: 8 },
			{ width: 8 },
			{ width: 9 },
			{ width: 14 },
			{ width: 18 },
			{ width: 9 },
			{ width: 9 },
		];
		const byDate = Map.groupBy(bySite.get(site) ?? [], (row) => row.date);
		const dates = [...byDate.keys()].sort();
		let top = 1;
		dates.forEach((date, index) => {
			const bottom = writeDay(sheet, top, byDate.get(date) ?? []);
			if (index < dates.length - 1) sheet.getRow(bottom).addPageBreak();
			top = bottom + 1;
		});
	}
	return workbook;
}

// 1日分を top の行から書き、最後の行の番号を返す
function writeDay(
	sheet: ExcelJS.Worksheet,
	top: number,
	group: CheckedRow[],
): number {
	const { date, site } = group[0];
	let row = top;

	merge(sheet, row, 1, 6, "工事日報", { bold: true, size: 18 });
	put(sheet, row, 7, "作成", { label: true, align: "center", size: 9 });
	put(sheet, row, 8, "確認", { label: true, align: "center", size: 9 });
	row++;
	// 押印かサインが入る高さ
	sheet.getRow(row).height = 40;
	put(sheet, row, 7, null, { border: true });
	put(sheet, row, 8, null, { border: true });
	row += 2;

	put(sheet, row, 1, "日付", { label: true });
	const day = toDate(date);
	merge(sheet, row, 2, 3, day, { border: true, numFmt: DATE_FORMAT });
	put(sheet, row, 4, `（${WEEKDAYS[day.getUTCDay()]}）`, { border: true });
	put(sheet, row, 5, "天候", { label: true });
	merge(
		sheet,
		row,
		6,
		8,
		uniqueTexts(group.map((line) => line.weather))[0] ?? "",
		{ border: true },
	);
	row++;
	put(sheet, row, 1, "現場名", { label: true });
	merge(sheet, row, 2, 8, site, { border: true });
	row += 2;

	const headers = ["作業員名", "開始", "終了", "休憩(分)", "作業時間(時間)"];
	headers.forEach((header, index) => {
		put(sheet, row, index + 1, header, { label: true, align: "center" });
	});
	merge(sheet, row, 6, 8, "作業内容", { label: true, align: "center" });
	row++;

	let totalMinutes = 0;
	for (const line of group) {
		const minutes = workMinutes(line.start, line.end, line.breakMinutes);
		totalMinutes += minutes;
		put(sheet, row, 1, line.worker, { border: true });
		put(sheet, row, 2, line.start / MINUTES_PER_DAY, {
			border: true,
			align: "center",
			numFmt: clockFormat(line.start),
		});
		put(sheet, row, 3, line.end / MINUTES_PER_DAY, {
			border: true,
			align: "center",
			numFmt: clockFormat(line.end),
		});
		put(sheet, row, 4, line.breakMinutes, { border: true });
		put(sheet, row, 5, minutes / 60, { border: true, numFmt: HOURS_FORMAT });
		merge(sheet, row, 6, 8, line.work ?? "", { border: true, wrap: true });
		row++;
	}
	put(sheet, row, 1, "合計", { label: true, bold: true });
	merge(
		sheet,
		row,
		2,
		4,
		`${new Set(group.map((line) => line.worker)).size}人`,
		{
			border: true,
			align: "center",
			bold: true,
		},
	);
	put(sheet, row, 5, totalMinutes / 60, {
		border: true,
		numFmt: HOURS_FORMAT,
		bold: true,
	});
	merge(sheet, row, 6, 8, null, { border: true });
	row += 2;

	const notes: [string, string[]][] = [
		["安全", uniqueTexts(group.map((line) => line.safety))],
		["備考", uniqueTexts(group.map((line) => line.note))],
	];
	notes.forEach(([label, lines], index) => {
		merge(sheet, row, 1, 8, label, { label: true });
		row++;
		merge(sheet, row, 1, 8, lines.join("\n"), { border: true, wrap: true });
		// 結合したセルは Excel が高さを自動で合わせないので、行数から決める
		sheet.getRow(row).height = Math.max(2, lines.length) * 18;
		if (index < notes.length - 1) row += 2;
	});
	return row;
}
