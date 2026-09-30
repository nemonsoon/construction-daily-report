import type { WorkRow } from "@/features/daily-report/input/read-input.ts";
import type { Finding } from "./finding.ts";

export function checkSameSiteDay(rows: WorkRow[]): Finding[] {
	const findings: Finding[] = [];
	const placed = rows.filter((row) => row.date !== null && row.site !== null);
	for (const group of Map.groupBy(
		placed,
		(row) => `${row.date}\t${row.site}`,
	).values()) {
		const weathers = [
			...new Set(
				group.flatMap((row) => (row.weather === null ? [] : [row.weather])),
			),
		];
		if (weathers.length > 1) {
			for (const row of group) {
				if (row.weather === null) continue;
				findings.push({
					rowNumber: row.rowNumber,
					column: "天候",
					message: `同じ日・同じ現場で天候が食い違っています（${weathers.join("、")}）`,
				});
			}
		}

		// 午前と夕方に分けて書いた行は通し、時間が重なる行（同じ行の書き写しなど）だけを指摘する。
		// 時刻の無い行は空欄の検査が知らせるので、ここでは比べない
		const timed = group.filter(
			(row) => row.worker !== null && row.start !== null && row.end !== null,
		);
		for (const same of Map.groupBy(timed, (row) => row.worker).values()) {
			const overlapping = same.filter((a) =>
				same.some(
					(b) =>
						a !== b &&
						(a.start ?? 0) < (b.end ?? 0) &&
						(b.start ?? 0) < (a.end ?? 0),
				),
			);
			if (overlapping.length < 2) continue;
			const numbers = overlapping.map((row) => row.rowNumber).join("・");
			for (const row of overlapping) {
				findings.push({
					rowNumber: row.rowNumber,
					column: "作業員名",
					message: `同じ日・同じ現場に、時間の重なる同じ作業員の行があります（${numbers}行目）`,
				});
			}
		}
	}
	return findings;
}
