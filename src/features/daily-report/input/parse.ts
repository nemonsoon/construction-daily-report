import type { RawValue } from "@/features/daily-report/excel/sheet.ts";

export type Parsed<T> =
	| { kind: "blank" }
	| { kind: "ok"; value: T }
	| { kind: "unreadable" };

const BLANK = { kind: "blank" } as const;
const UNREADABLE = { kind: "unreadable" } as const;
const EXCEL_EPOCH = Date.UTC(1899, 11, 30);
const DAY_MS = 86_400_000;
// 桁の打ち間違い（20260901 を数値で入れた等）を日付として通さないため、日報として有り得る年に限る
const MIN_YEAR = 2000;
const MAX_YEAR = 2100;

function ok<T>(value: T): Parsed<T> {
	return { kind: "ok", value };
}

function normalized(raw: RawValue): RawValue {
	return typeof raw === "string" ? raw.normalize("NFKC").trim() : raw;
}

function isoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

function okDate(date: Date): Parsed<string> {
	const year = date.getUTCFullYear();
	if (Number.isNaN(year) || year < MIN_YEAR || year > MAX_YEAR) {
		return UNREADABLE;
	}
	return ok(isoDate(date));
}

// 和暦の元年の西暦。令和は2019年5月、平成は1989年1月から
const ERAS: Record<string, number> = {
	令和: 2019,
	R: 2019,
	平成: 1989,
	H: 1989,
};

function parseYearMonthDay(text: string): [number, number, number] | null {
	const western = /^(\d{4})[/\-.年](\d{1,2})[/\-.月](\d{1,2})日?$/.exec(text);
	if (western) {
		return [Number(western[1]), Number(western[2]), Number(western[3])];
	}
	const japanese =
		/^(令和|平成|R|H)(元|\d{1,2})[/\-.年](\d{1,2})[/\-.月](\d{1,2})日?$/i.exec(
			text,
		);
	if (!japanese) return null;
	const first = ERAS[japanese[1].toUpperCase()] ?? ERAS[japanese[1]];
	const eraYear = japanese[2] === "元" ? 1 : Number(japanese[2]);
	return [first + eraYear - 1, Number(japanese[3]), Number(japanese[4])];
}

export function parseDate(raw: RawValue): Parsed<string> {
	const value = normalized(raw);
	if (value === null || value === "") return BLANK;
	if (value instanceof Date) return okDate(value);
	if (typeof value === "number") {
		return okDate(new Date(EXCEL_EPOCH + Math.floor(value) * DAY_MS));
	}
	// 「2026/9/1（火）」のように後ろに付いた曜日は読み飛ばす（全角の括弧は NFKC で半角になる）
	const text = value.replace(/\s*\([日月火水木金土]\)$/, "");
	const ymd = parseYearMonthDay(text);
	if (!ymd) return UNREADABLE;
	const [year, month, day] = ymd;
	const date = new Date(Date.UTC(year, month - 1, day));
	if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
		return UNREADABLE;
	}
	return okDate(date);
}

// 日をまたぐ夜の作業は、翌日の時刻を 1440分（24:00）以上で表す。
// 書き間違い（開始と終了の入れ替え）を夜の作業と取り違えないよう、翌日と読むのは
// 「翌6:00」「30:00」のように翌日だと書いてあるときだけにする
const MINUTES_PER_DAY = 1440;

export function parseTime(raw: RawValue): Parsed<number> {
	const value = normalized(raw);
	if (value === null || value === "") return BLANK;
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) return UNREADABLE;
		const clock = value.getUTCHours() * 60 + value.getUTCMinutes();
		// Excel に「30:00」と打つと 1899-12-31 6:00 として読まれる
		const nextDay = Math.floor((value.getTime() - EXCEL_EPOCH) / DAY_MS) === 1;
		return ok(nextDay ? clock + MINUTES_PER_DAY : clock);
	}
	if (typeof value === "number") {
		return value >= 0 && value < 2
			? ok(Math.round(value * MINUTES_PER_DAY))
			: UNREADABLE;
	}
	// 「8:00:00」の秒は読み飛ばす
	const match =
		/^(翌)?(\d{1,2})(?::(\d{2})(?::\d{2})?|時(?:(\d{1,2})分)?)$/.exec(value);
	if (!match) return UNREADABLE;
	const nextDay = match[1] !== undefined;
	const hours = Number(match[2]);
	const minutes = Number(match[3] ?? match[4] ?? 0);
	if (hours > (nextDay ? 23 : 47) || minutes > 59) return UNREADABLE;
	return ok((nextDay ? MINUTES_PER_DAY : 0) + hours * 60 + minutes);
}

export function parseBreak(raw: RawValue): Parsed<number> {
	const value = normalized(raw);
	if (value === null || value === "") return BLANK;
	if (typeof value === "number") {
		return value >= 0 ? ok(Math.round(value)) : UNREADABLE;
	}
	if (typeof value === "string") {
		const match = /^(\d+)分?$/.exec(value);
		return match ? ok(Number(match[1])) : UNREADABLE;
	}
	return UNREADABLE;
}

// 自由記述は書かれたとおりに残す（NFKC で全角英数字を変えない）
export function parseText(raw: RawValue): string | null {
	if (raw === null) return null;
	const text = raw instanceof Date ? isoDate(raw) : String(raw).trim();
	return text === "" ? null : text;
}

// 現場名と作業員名は、全角と半角の違いと空白の数の違いをそろえ、同じ現場や同じ人として数える。
// 「山田邸」と「山田邸 新築工事」のように言葉が違うものは別の現場の可能性があるので、そろえない
export function parseName(raw: RawValue): string | null {
	const text = parseText(raw);
	return text === null ? null : text.normalize("NFKC").replace(/\s+/g, " ");
}
