import type { ColumnName } from "@/features/daily-report/input/columns.ts";

export type Finding = {
	rowNumber: number;
	column: ColumnName;
	message: string;
};

export function formatFinding(finding: Finding): string {
	return `${finding.rowNumber}行目 ${finding.column}: ${finding.message}`;
}
