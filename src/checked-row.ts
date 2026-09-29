import type { WorkRow } from "./read-input.ts";

export type CheckedRow = {
	rowNumber: number;
	date: string;
	site: string;
	weather: string | null;
	worker: string;
	start: number;
	end: number;
	breakMinutes: number;
	work: string | null;
	safety: string | null;
	note: string | null;
};

export function toCheckedRows(rows: WorkRow[]): CheckedRow[] {
	return rows.map((row) => {
		const { date, site, worker, start, end } = row;
		if (
			date === null ||
			site === null ||
			worker === null ||
			start === null ||
			end === null
		) {
			throw new Error(`${row.rowNumber}行目は検査を通っていません`);
		}
		return {
			rowNumber: row.rowNumber,
			date,
			site,
			weather: row.weather,
			worker,
			start,
			end,
			breakMinutes: row.breakMinutes ?? 0,
			work: row.work,
			safety: row.safety,
			note: row.note,
		};
	});
}
