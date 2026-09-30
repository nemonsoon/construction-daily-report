import { HEADING_ID } from "@/lib/screen.ts";
import { CheckStep } from "./components/check-step.tsx";
import { FinishedBand } from "./components/finished-band.tsx";
import { ReportStep } from "./components/report-step.tsx";
import { SampleStep } from "./components/sample-step.tsx";
import { useBlockPageDrop } from "./hooks/use-block-page-drop.ts";
import { TryFlowProvider, useTryFlowContext } from "./try-flow-context.tsx";

export function TryPage() {
	useBlockPageDrop();

	return (
		<TryFlowProvider>
			<div className="min-h-[calc(100dvh-4rem)] bg-surface">
				<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
					<h1
						id={HEADING_ID.app}
						tabIndex={-1}
						className="text-center text-3xl font-bold tracking-tight outline-none sm:text-4xl"
					>
						見本で試す
					</h1>
					<p className="mt-3 text-center text-muted-foreground">
						上から順に進めると、最後に日報と集計表のExcelが手に入ります。
					</p>
					<ol className="mt-10 space-y-6">
						<SampleStep />
						<CheckStep />
						<ReportStep />
					</ol>
					<Finished />
				</div>
			</div>
		</TryFlowProvider>
	);
}

function Finished() {
	const { state } = useTryFlowContext();
	return state.report.kind === "done" ? <FinishedBand /> : null;
}
