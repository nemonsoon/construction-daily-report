import type { Finding } from "../finding.ts";
import type { WorkRow } from "../read-input.ts";

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

		const named = group.filter((row) => row.worker !== null);
		for (const same of Map.groupBy(named, (row) => row.worker).values()) {
			if (same.length < 2) continue;
			const numbers = same.map((row) => row.rowNumber).join("・");
			for (const row of same) {
				findings.push({
					rowNumber: row.rowNumber,
					column: "作業員名",
					message: `同じ日・同じ現場に同じ作業員の行が複数あります（${numbers}行目）`,
				});
			}
		}
	}
	return findings;
}
