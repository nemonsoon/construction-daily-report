import { Download, Loader2 } from "lucide-react";
import { type ReactNode, useEffect, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { runCheck, runReport } from "../pipeline.ts";
import { makeSampleWorkbook } from "../sample-data.ts";
import { toBytes } from "../sheet.ts";
import { download } from "./download.ts";
import { FileDrop } from "./FileDrop.tsx";
import { FindingList } from "./FindingList.tsx";
import {
	errorMessage,
	flowReducer,
	initialFlow,
	isBusy,
	stepMarks,
} from "./flow.ts";
import { StepCard } from "./StepCard.tsx";

const TONES = {
	caution: "border-caution bg-caution-soft",
	done: "border-tape bg-tape-soft",
	error: "border-destructive/40 bg-destructive/5 text-destructive",
	plain: "border-hogan bg-white",
};

function Notice({
	tone,
	children,
}: {
	tone: keyof typeof TONES;
	children: ReactNode;
}) {
	return (
		<div
			role="status"
			className={`rounded-md border-l-4 px-4 py-3 ${TONES[tone]}`}
		>
			{children}
		</div>
	);
}

function Loading() {
	return (
		<Notice tone="plain">
			<span className="inline-flex items-center gap-2">
				<Loader2
					aria-hidden
					className="size-4 animate-spin motion-reduce:animate-none"
				/>
				読み込んでいます…
			</span>
		</Notice>
	);
}

export function Steps() {
	const [state, dispatch] = useReducer(flowReducer, initialFlow);
	const [sampleMark, checkMark, reportMark] = stepMarks(state);
	const busy = isBusy(state);

	// 受け取り枠の外にファイルを落とすと、ブラウザがそのファイルを開いてページが消えるため止める
	useEffect(() => {
		const stop = (event: DragEvent) => event.preventDefault();
		window.addEventListener("dragover", stop);
		window.addEventListener("drop", stop);
		return () => {
			window.removeEventListener("dragover", stop);
			window.removeEventListener("drop", stop);
		};
	}, []);

	async function takeSample() {
		download(
			await toBytes(makeSampleWorkbook().workbook),
			"見本_工事日報.xlsx",
		);
		dispatch({ type: "sampleTaken" });
	}

	async function check(file: File) {
		dispatch({ type: "checkStarted" });
		try {
			const { findings, review } = await runCheck(await file.arrayBuffer());
			download(review, "要確認.xlsx");
			dispatch({ type: "checkFinished", findings });
		} catch (error) {
			dispatch({ type: "checkFailed", message: errorMessage(error) });
		}
	}

	async function report(file: File) {
		dispatch({ type: "reportStarted" });
		try {
			const result = await runReport(await file.arrayBuffer());
			if (!result.ok) {
				dispatch({ type: "reportRemaining", findings: result.findings });
				return;
			}
			download(result.daily, "日報.xlsx");
			download(result.summary, "集計表.xlsx");
			dispatch({ type: "reportDone" });
		} catch (error) {
			dispatch({ type: "reportFailed", message: errorMessage(error) });
		}
	}

	return (
		<section
			id="try"
			className="scroll-mt-6 border-y border-hogan bg-hogan-grid"
		>
			<div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
				<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
					見本で試す
				</h2>
				<p className="mt-3 text-muted-foreground">
					3段で終わります。手元の日報の Excel でも試せます。
				</p>

				<ol className="mt-10 space-y-6">
					<StepCard number={1} title="見本の日報を手に入れる" mark={sampleMark}>
						<p>
							手元に日報が無ければ、書き間違いを9か所仕込んだ見本を使ってください。
						</p>
						<Button onClick={takeSample} size="lg">
							<Download aria-hidden />
							見本の Excel をダウンロード
						</Button>
						{state.sampleTaken && (
							<Notice tone="done">
								見本_工事日報.xlsx をダウンロードしました。
							</Notice>
						)}
					</StepCard>

					<StepCard number={2} title="日報の Excel を置く" mark={checkMark}>
						<p>
							書き忘れや食い違いのあるセルを黄色く塗り、「指摘」の列に理由を書いた
							<b> 要確認.xlsx </b>をダウンロードします。
						</p>
						<FileDrop
							id="check-file"
							label="日報の Excel"
							disabled={busy}
							onFile={check}
						/>
						{state.check.kind === "loading" && <Loading />}
						{state.check.kind === "error" && (
							<Notice tone="error">{state.check.message}</Notice>
						)}
						{state.check.kind === "clean" && (
							<Notice tone="done">
								書き忘れや食い違いは見つかりませんでした。要確認.xlsx
								をそのまま手順3に置けます。
							</Notice>
						)}
						{state.check.kind === "found" && (
							<Notice tone="caution">
								確かめてほしい所が {state.check.findings.length}{" "}
								か所あります。要確認.xlsx の黄色いセルを直して保存してください。
								<FindingList findings={state.check.findings} />
							</Notice>
						)}
					</StepCard>

					<StepCard
						number={3}
						title="直した要確認.xlsx を置く"
						mark={reportMark}
					>
						<p>
							指摘が残っていなければ、<b>日報.xlsx</b> と <b>集計表.xlsx</b>{" "}
							をダウンロードします。
						</p>
						<FileDrop
							id="report-file"
							label="直した要確認.xlsx"
							disabled={busy}
							onFile={report}
						/>
						{state.report.kind === "loading" && <Loading />}
						{state.report.kind === "error" && (
							<Notice tone="error">{state.report.message}</Notice>
						)}
						{state.report.kind === "remaining" && (
							<Notice tone="caution">
								まだ {state.report.findings.length}{" "}
								か所が残っているため、日報と集計表は作りませんでした。
								<FindingList findings={state.report.findings} />
							</Notice>
						)}
						{state.report.kind === "done" && (
							<Notice tone="done">
								日報.xlsx と集計表.xlsx をダウンロードしました。
							</Notice>
						)}
					</StepCard>
				</ol>
			</div>
		</section>
	);
}
