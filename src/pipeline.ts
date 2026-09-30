import { toCheckedRows } from "./checked-row.ts";
import { runChecks } from "./checks/index.ts";
import { buildDailyReports } from "./daily-report.ts";
import type { Finding } from "./finding.ts";
import { readInput } from "./read-input.ts";
import { markReview } from "./review.ts";
import { loadWorkbook, toBytes } from "./sheet.ts";
import { buildSummaryWorkbook, summarize } from "./summary.ts";

export async function runCheck(
	data: ArrayBuffer | Uint8Array,
): Promise<{ findings: Finding[]; review: Uint8Array<ArrayBuffer> }> {
	const workbook = await loadWorkbook(data);
	const findings = runChecks(readInput(workbook));
	markReview(workbook, findings);
	return { findings, review: await toBytes(workbook) };
}

// 集計表の作成日。利用者のパソコンの暦で今日の日付にする
function today(): string {
	const now = new Date();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${now.getFullYear()}-${month}-${day}`;
}

export async function runReport(
	data: ArrayBuffer | Uint8Array,
	createdOn: string = today(),
): Promise<
	| { ok: false; findings: Finding[] }
	| {
			ok: true;
			daily: Uint8Array<ArrayBuffer>;
			summary: Uint8Array<ArrayBuffer>;
	  }
> {
	const rows = readInput(await loadWorkbook(data));
	const findings = runChecks(rows);
	if (findings.length > 0) return { ok: false, findings };

	const checked = toCheckedRows(rows);
	return {
		ok: true,
		daily: await toBytes(buildDailyReports(checked)),
		summary: await toBytes(buildSummaryWorkbook(summarize(checked), createdOn)),
	};
}
