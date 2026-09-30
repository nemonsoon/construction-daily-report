import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FILE_NAME } from "@/config/files.ts";
import { useTryFlowContext } from "../try-flow-context.tsx";
import { Notice } from "./notice.tsx";
import { StepCard } from "./step-card.tsx";

export function SampleStep() {
	const {
		state,
		marks: [mark],
		takeSample,
	} = useTryFlowContext();

	return (
		<StepCard number={1} title="見本の日報をダウンロードする" mark={mark}>
			<p>書き忘れや食い違いを9か所入れた、練習用の日報です。</p>
			<Button
				onClick={takeSample}
				variant={mark === "current" ? "default" : "outline"}
				className="h-11 px-5 text-base"
			>
				<Download aria-hidden />
				見本をダウンロード
			</Button>
			{state.sampleTaken && (
				<Notice tone="done">{FILE_NAME.sample} をダウンロードしました。</Notice>
			)}
		</StepCard>
	);
}
