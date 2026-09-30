import type { WorkRow } from "@/features/daily-report/input/read-input.ts";
import type { Finding } from "./finding.ts";
import { checkMissing } from "./missing.ts";
import { checkSameSiteDay } from "./same-site-day.ts";
import { checkTimes } from "./times.ts";

export function runChecks(rows: WorkRow[]): Finding[] {
	return [
		...checkMissing(rows),
		...checkTimes(rows),
		...checkSameSiteDay(rows),
	].sort((a, b) => a.rowNumber - b.rowNumber);
}
