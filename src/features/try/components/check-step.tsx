import { FILE_NAME } from "@/config/files.ts";
import { useTryFlowContext } from "../try-flow-context.tsx";
import { FileDrop } from "./file-drop.tsx";
import { FindingList } from "./finding-list.tsx";
import { Loading, Notice } from "./notice.tsx";
import { OutputFiles } from "./output-files.tsx";
import { StepCard } from "./step-card.tsx";

export function CheckStep() {
	const {
		state: { check: result },
		marks: [, mark],
		busy,
		check,
	} = useTryFlowContext();

	return (
		<StepCard number={2} title="書き忘れを確かめる" mark={mark}>
			<p>
				日報を読み込むと、直してほしいセルを黄色く塗った
				<b>{FILE_NAME.review}</b> がダウンロードされます。
			</p>
			<FileDrop
				id="check-file"
				label="日報のExcelを読み込む"
				disabled={busy}
				primary={mark === "current"}
				onFile={check}
			/>
			{result.kind === "loading" && <Loading />}
			{result.kind === "error" && (
				<Notice tone="error">{result.message}</Notice>
			)}
			{result.kind === "clean" && (
				<Notice tone="done">
					<p>
						書き忘れや食い違いは見つかりませんでした。{FILE_NAME.review}{" "}
						をそのまま手順3で読み込めます。
					</p>
					<OutputFiles files={[result.review]} />
				</Notice>
			)}
			{result.kind === "found" && (
				<div role="status" className="space-y-3">
					<FindingList
						title={`確かめてほしい所が ${result.findings.length} か所あります`}
						findings={result.findings}
					/>
					<OutputFiles files={[result.review]} />
					<p>{FILE_NAME.review} の黄色いセルを直して保存してください。</p>
				</div>
			)}
		</StepCard>
	);
}
