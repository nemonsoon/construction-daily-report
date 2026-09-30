import type { Finding } from "@/features/daily-report/checks/finding.ts";
import { runChecks } from "@/features/daily-report/checks/index.ts";
import { loadWorkbook, toBytes } from "@/features/daily-report/excel/sheet.ts";
import { readInput } from "@/features/daily-report/input/read-input.ts";
import { toCheckedRows } from "@/features/daily-report/outputs/checked-row.ts";
import { buildDailyReports } from "@/features/daily-report/outputs/daily-report.ts";
import { markReview } from "@/features/daily-report/outputs/review.ts";
import {
	buildSummaryWorkbook,
	summarize,
} from "@/features/daily-report/outputs/summary.ts";
import { makeSampleWorkbook } from "@/features/daily-report/sample/sample-data.ts";

// 書き忘れや食い違いを仕込んだ練習用の日報
export async function makeSampleFile(): Promise<Uint8Array<ArrayBuffer>> {
	return toBytes(makeSampleWorkbook().workbook);
}

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
