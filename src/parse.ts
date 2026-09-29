import type { RawValue } from "./sheet.ts";

export type Parsed<T> =
	| { kind: "blank" }
	| { kind: "ok"; value: T }
	| { kind: "unreadable" };

const BLANK = { kind: "blank" } as const;
const UNREADABLE = { kind: "unreadable" } as const;
const EXCEL_EPOCH = Date.UTC(1899, 11, 30);
const DAY_MS = 86_400_000;

function ok<T>(value: T): Parsed<T> {
	return { kind: "ok", value };
}

function normalized(raw: RawValue): RawValue {
	return typeof raw === "string" ? raw.normalize("NFKC").trim() : raw;
}

function isoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

export function parseDate(raw: RawValue): Parsed<string> {
	const value = normalized(raw);
	if (value === null || value === "") return BLANK;
	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? UNREADABLE : ok(isoDate(value));
	}
	if (typeof value === "number") {
		return value >= 1
			? ok(isoDate(new Date(EXCEL_EPOCH + Math.floor(value) * DAY_MS)))
			: UNREADABLE;
	}
	const match = /^(\d{4})[/\-.年](\d{1,2})[/\-.月](\d{1,2})日?$/.exec(value);
	if (!match) return UNREADABLE;
	const [year, month, day] = [
		Number(match[1]),
		Number(match[2]),
		Number(match[3]),
	];
	const date = new Date(Date.UTC(year, month - 1, day));
	if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
		return UNREADABLE;
	}
	return ok(isoDate(date));
}

export function parseTime(raw: RawValue): Parsed<number> {
	const value = normalized(raw);
	if (value === null || value === "") return BLANK;
	if (value instanceof Date) {
		return Number.isNaN(value.getTime())
			? UNREADABLE
			: ok(value.getUTCHours() * 60 + value.getUTCMinutes());
	}
	if (typeof value === "number") {
		return value >= 0 && value < 1 ? ok(Math.round(value * 1440)) : UNREADABLE;
	}
	const match = /^(\d{1,2})(?::(\d{2})|時(?:(\d{1,2})分)?)$/.exec(value);
	if (!match) return UNREADABLE;
	const hours = Number(match[1]);
	const minutes = Number(match[2] ?? match[3] ?? 0);
	if (hours > 23 || minutes > 59) return UNREADABLE;
	return ok(hours * 60 + minutes);
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
