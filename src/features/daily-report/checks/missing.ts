import type { ColumnName } from "@/features/daily-report/input/columns.ts";
import type { WorkRow } from "@/features/daily-report/input/read-input.ts";
import type { Finding } from "./finding.ts";

const REQUIRED: ReadonlyArray<readonly [ColumnName, keyof WorkRow]> = [
	["日付", "date"],
	["現場名", "site"],
	["作業員名", "worker"],
	["開始時刻", "start"],
	["終了時刻", "end"],
];

const EXAMPLES: Partial<Record<ColumnName, string>> = {
	日付: "2026/9/1",
	開始時刻: "8:00",
	終了時刻: "17:00",
	"休憩(分)": "60",
};

export function checkMissing(rows: WorkRow[]): Finding[] {
	const findings: Finding[] = [];
	for (const row of rows) {
		for (const column of row.unreadable) {
			const example = EXAMPLES[column];
			findings.push({
				rowNumber: row.rowNumber,
				column,
				message: `「${column}」の値を読み取れません${example ? `（例: ${example}）` : ""}`,
			});
		}
		for (const [column, key] of REQUIRED) {
			if (row[key] !== null || row.unreadable.includes(column)) continue;
			findings.push({
				rowNumber: row.rowNumber,
				column,
				message: `「${column}」が空欄です`,
			});
		}
	}
	return findings;
}
