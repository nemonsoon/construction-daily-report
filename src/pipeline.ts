import { runChecks } from "./checks/index.ts";
import type { Finding } from "./finding.ts";
import { readInput } from "./read-input.ts";
import { markReview } from "./review.ts";
import { loadWorkbook, toBytes } from "./sheet.ts";

export async function runCheck(
	data: ArrayBuffer | Uint8Array,
): Promise<{ findings: Finding[]; review: Uint8Array<ArrayBuffer> }> {
	const workbook = await loadWorkbook(data);
	const findings = runChecks(readInput(workbook));
	markReview(workbook, findings);
	return { findings, review: await toBytes(workbook) };
}
