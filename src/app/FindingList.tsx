import type { ReactNode } from "react";
import type { Finding } from "../finding.ts";

type Props = {
	title: ReactNode;
	findings: Finding[];
};

export function FindingList({ title, findings }: Props) {
	return (
		<div className="overflow-hidden rounded-xl border border-line bg-white">
			<p className="flex items-center gap-2 border-b border-line px-4 py-3 font-bold">
				<span aria-hidden className="size-2.5 shrink-0 rounded-sm bg-caution" />
				{title}
			</p>
			<div className="max-h-72 overflow-y-auto">
				<table className="w-full text-sm tabular-nums">
					<thead className="sticky top-0 bg-surface text-left text-muted-foreground">
						<tr>
							<th
								scope="col"
								className="w-12 py-2 pr-2 pl-4 font-medium sm:w-14"
							>
								行
							</th>
							{/* スマートフォン幅では項目の列を消し、指摘の文の上に出す（指摘の列が押しつぶされるため） */}
							<th
								scope="col"
								className="hidden w-28 px-4 py-2 font-medium sm:table-cell"
							>
								項目
							</th>
							<th scope="col" className="py-2 pr-4 pl-2 font-medium sm:px-4">
								指摘
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-line">
						{findings.map((finding) => (
							<tr
								key={`${finding.rowNumber}-${finding.column}-${finding.message}`}
							>
								<td className="py-2 pr-2 pl-4 align-top">
									{finding.rowNumber}
								</td>
								<td className="hidden px-4 py-2 align-top whitespace-nowrap sm:table-cell">
									{finding.column}
								</td>
								<td className="py-2 pr-4 pl-2 sm:px-4">
									<span className="block text-xs text-muted-foreground sm:hidden">
										{finding.column}
									</span>
									{finding.message}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
