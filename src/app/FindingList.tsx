import { type Finding, formatFinding } from "../finding.ts";

export function FindingList({ findings }: { findings: Finding[] }) {
	return (
		<ul className="mt-3 max-h-64 space-y-1 overflow-y-auto rounded-md border border-hogan bg-white p-3 font-cell text-sm">
			{findings.map((finding) => (
				<li
					key={`${finding.rowNumber}-${finding.column}-${finding.message}`}
					className="flex gap-2"
				>
					<span
						aria-hidden
						className="mt-1.5 size-2.5 shrink-0 rounded-sm bg-caution"
					/>
					<span>{formatFinding(finding)}</span>
				</li>
			))}
		</ul>
	);
}
