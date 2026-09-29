import type { Finding } from "../finding.ts";
import type { WorkRow } from "../read-input.ts";
import { checkMissing } from "./missing.ts";

export function runChecks(rows: WorkRow[]): Finding[] {
	return [...checkMissing(rows)].sort((a, b) => a.rowNumber - b.rowNumber);
}
