import ExcelJS from "exceljs";
import { type ColumnName, INPUT_COLUMNS } from "./columns.ts";

export type Planted = { rowNumber: number; column: ColumnName; reason: string };

type SampleRecord = {
	date: Date;
	site: string | null;
	weather: string;
	worker: string;
	start: Date | string;
	end: Date;
	breakMinutes: number;
	work: string;
	safety: string;
	note: string;
};

const SITES = [
	{
		site: "山田邸 新築工事",
		crew: ["田中 一郎", "佐藤 健"],
		work: ["基礎の型枠くみたて", "配筋 午後検査まち", "型枠ばらし 清掃"],
	},
	{
		site: "駅前店舗 改装工事",
		crew: ["鈴木 大輔", "高橋 誠"],
		work: ["天井ボード はり", "間仕切り 下地", "既存床 はがし 産廃まとめ"],
	},
	{
		site: "第二倉庫 屋根補修",
		crew: ["伊藤 翔"],
		work: ["屋根材 はがし", "防水シート 施工"],
	},
];

const WEATHERS = ["晴", "晴", "曇", "雨"];

// Excel の時刻だけのセルは 1899-12-30 の日時として保存される
function clock(hours: number, minutes = 0): Date {
	return new Date(Date.UTC(1899, 11, 30, hours, minutes));
}

function weekdays(year: number, month: number, count: number): Date[] {
	const days: Date[] = [];
	for (let day = 1; days.length < count; day++) {
		const date = new Date(Date.UTC(year, month - 1, day));
		const weekday = date.getUTCDay();
		if (weekday !== 0 && weekday !== 6) days.push(date);
	}
	return days;
}

export function makeSampleWorkbook(): {
	workbook: ExcelJS.Workbook;
	planted: Planted[];
} {
	const days = weekdays(2026, 9, 10);
	const records: SampleRecord[] = [];
	days.forEach((date, dayIndex) => {
		const weather = WEATHERS[dayIndex % WEATHERS.length];
		for (const { site, crew, work } of SITES) {
			for (const worker of crew) {
				records.push({
					date,
					site,
					weather,
					worker,
					start: clock(8),
					end: clock(17),
					breakMinutes: 60,
					work: work[dayIndex % work.length],
					safety: dayIndex % 3 === 0 ? "朝礼で足場の点検をした" : "",
					note: "",
				});
			}
		}
	});

	const find = (dayIndex: number, worker: string): number => {
		const index = records.findIndex(
			(record) => record.date === days[dayIndex] && record.worker === worker,
		);
		if (index < 0) throw new Error(`見本の行が見つかりません: ${worker}`);
		return index;
	};
	const rowOf = (index: number): number => index + 2;
	const planted: Planted[] = [];

	const blankSite = find(1, "佐藤 健");
	records[blankSite].site = null;
	planted.push({
		rowNumber: rowOf(blankSite),
		column: "現場名",
		reason: "現場名の書き忘れ",
	});

	const unreadableStart = find(2, "鈴木 大輔");
	records[unreadableStart].start = "8時ごろ";
	planted.push({
		rowNumber: rowOf(unreadableStart),
		column: "開始時刻",
		reason: "時刻を文で書いた",
	});

	const endBeforeStart = find(3, "高橋 誠");
	records[endBeforeStart].end = clock(7);
	planted.push({
		rowNumber: rowOf(endBeforeStart),
		column: "終了時刻",
		reason: "17時を7時と書いた",
	});

	const overlapBase = find(4, "伊藤 翔");
	records.push({
		...records[overlapBase],
		site: "山田邸 新築工事",
		start: clock(13),
		end: clock(17),
		work: "片付け 応援",
	});
	planted.push(
		{
			rowNumber: rowOf(overlapBase),
			column: "開始時刻",
			reason: "同じ人が同じ時間に2つの現場にいる",
		},
		{
			rowNumber: rowOf(records.length - 1),
			column: "開始時刻",
			reason: "同じ人が同じ時間に2つの現場にいる",
		},
	);

	const weatherMismatch = find(5, "佐藤 健");
	records[weatherMismatch].weather =
		records[weatherMismatch].weather === "雨" ? "晴" : "雨";
	planted.push(
		{
			rowNumber: rowOf(weatherMismatch),
			column: "天候",
			reason: "同じ現場で天候が違う",
		},
		{
			rowNumber: rowOf(find(5, "田中 一郎")),
			column: "天候",
			reason: "同じ現場で天候が違う",
		},
	);

	const duplicated = find(6, "鈴木 大輔");
	records.push({ ...records[duplicated] });
	planted.push(
		{
			rowNumber: rowOf(duplicated),
			column: "作業員名",
			reason: "同じ行を2回転記した",
		},
		{
			rowNumber: rowOf(records.length - 1),
			column: "作業員名",
			reason: "同じ行を2回転記した",
		},
	);

	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet("工事日報");
	sheet.addRow([...INPUT_COLUMNS]);
	for (const record of records) {
		const row = sheet.addRow([
			record.date,
			record.site,
			record.weather,
			record.worker,
			record.start,
			record.end,
			record.breakMinutes,
			record.work,
			record.safety,
			record.note,
		]);
		row.getCell(1).numFmt = "yyyy/m/d";
		row.getCell(5).numFmt = "h:mm";
		row.getCell(6).numFmt = "h:mm";
	}
	return { workbook, planted };
}
