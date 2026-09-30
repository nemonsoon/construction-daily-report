import { FILE_NAME } from "@/config/files.ts";
import { useTryFlowContext } from "../try-flow-context.tsx";
import { FileDrop } from "./file-drop.tsx";
import { FindingList } from "./finding-list.tsx";
import { Loading, Notice } from "./notice.tsx";
import { OutputFiles } from "./output-files.tsx";
import { StepCard } from "./step-card.tsx";

export function ReportStep() {
	const {
		state: { report: result },
		marks: [, , mark],
		busy,
		report,
	} = useTryFlowContext();

	return (
		<StepCard number={3} title="日報と集計表にまとめる" mark={mark}>
			<p>
				直した{FILE_NAME.review} を読み込むと、<b>{FILE_NAME.daily}</b> と
				<b>{FILE_NAME.summary}</b> がダウンロードされます。
			</p>
			<FileDrop
				id="report-file"
				label="直したExcelを読み込む"
				disabled={busy}
				primary={mark === "current"}
				onFile={report}
			/>
			{result.kind === "loading" && <Loading />}
			{result.kind === "error" && (
				<Notice tone="error">{result.message}</Notice>
			)}
			{result.kind === "remaining" && (
				<div role="status">
					<FindingList
						title={`まだ ${result.findings.length} か所が残っているため、日報と集計表は作りませんでした`}
						findings={result.findings}
					/>
				</div>
			)}
			{result.kind === "done" && (
				<Notice tone="done">
					<p>
						{FILE_NAME.daily} と{FILE_NAME.summary} をダウンロードしました。
					</p>
					<OutputFiles files={result.files} />
				</Notice>
			)}
		</StepCard>
	);
}
