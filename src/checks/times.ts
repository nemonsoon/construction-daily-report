import type { Finding } from "../finding.ts";
import type { WorkRow } from "../read-input.ts";

type Interval = WorkRow & { start: number; end: number; site: string };

function hasInterval(row: WorkRow): row is Interval {
	return (
		row.start !== null &&
		row.end !== null &&
		row.end > row.start &&
		row.site !== null
	);
}

export function checkTimes(rows: WorkRow[]): Finding[] {
	const findings: Finding[] = [];
	for (const row of rows) {
		if (row.start === null || row.end === null) continue;
		if (row.end <= row.start) {
			findings.push({
				rowNumber: row.rowNumber,
				column: "終了時刻",
				message: "終了時刻が開始時刻と同じか、それより前です",
			});
			continue;
		}
		if (row.breakMinutes !== null && row.breakMinutes >= row.end - row.start) {
			findings.push({
				rowNumber: row.rowNumber,
				column: "休憩(分)",
				message: "休憩が作業時間と同じか、それより長いです",
			});
		}
	}

	const candidates = rows
		.filter(hasInterval)
		.filter((row) => row.date !== null && row.worker !== null);
	for (const group of Map.groupBy(
		candidates,
		(row) => `${row.date}\t${row.worker}`,
	).values()) {
		for (const a of group) {
			for (const b of group) {
				if (a === b || a.site === b.site) continue;
				if (a.start < b.end && b.start < a.end) {
					findings.push({
						rowNumber: a.rowNumber,
						column: "開始時刻",
						message: `同じ日の${b.rowNumber}行目（${b.site}）と時間が重なっています`,
					});
				}
			}
		}
	}
	return findings;
}
