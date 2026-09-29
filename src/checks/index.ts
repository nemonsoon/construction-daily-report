import type { Finding } from "../finding.ts";
import type { WorkRow } from "../read-input.ts";
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
