import {
	ArrowRight,
	CircleCheck,
	Download,
	FileSpreadsheet,
	LayoutTemplate,
	Loader2,
} from "lucide-react";
import { type ReactNode, useEffect, useReducer, useState } from "react";
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
import { REPO } from "./SiteFooter.tsx";
import { StepCard } from "./StepCard.tsx";
import { Stepper } from "./Stepper.tsx";
import { HEADING_ID } from "./screen.ts";

const TONES = {
	done: "bg-tape-soft",
	error: "border-l-4 border-destructive/40 bg-destructive/5 text-destructive",
	plain: "border border-line bg-white",
};

function Notice({
	tone,
	children,
}: {
	tone: keyof typeof TONES;
	children: ReactNode;
}) {
	return (
		// 読めなかった知らせは、読み上げの途中でも割り込んで伝える
		<div
			role={tone === "error" ? "alert" : "status"}
			className={`rounded-xl px-4 py-3 ${TONES[tone]}`}
		>
			{tone === "done" ? (
				<div className="flex items-start gap-2">
					<CircleCheck
						aria-hidden
						className="mt-0.5 size-5 shrink-0 text-tape"
					/>
					<div className="min-w-0 flex-1 space-y-3">{children}</div>
				</div>
			) : (
				children
			)}
		</div>
	);
}

type OutputFile = {
	name: string;
	note: string;
	bytes: Uint8Array<ArrayBuffer>;
};

// 自動のダウンロードをブラウザが止めても一周が止まらないよう、札ごとに取り直せるようにする
function Outputs({ files }: { files: OutputFile[] }) {
	return (
		<ul className="space-y-3">
			{files.map(({ name, note, bytes }) => (
				<li
					key={name}
					className="flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3"
				>
					<FileSpreadsheet
						aria-hidden
						className="size-6 shrink-0"
						strokeWidth={1.75}
					/>
					<span className="min-w-0 flex-1">
						<span className="block font-bold">{name}</span>
						<span className="block text-sm text-muted-foreground">{note}</span>
					</span>
					<Button
						variant="outline"
						onClick={() => download(bytes, name)}
						aria-label={`${name} をダウンロード`}
						className="size-11 sm:w-auto sm:px-4"
					>
						<Download aria-hidden />
						{/* スマートフォン幅ではアイコンだけにして、ファイル名と説明の幅を空ける */}
						<span className="hidden sm:inline">ダウンロード</span>
					</Button>
				</li>
			))}
		</ul>
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
	const marks = stepMarks(state);
	const [sampleMark, checkMark, reportMark] = marks;
	const busy = isBusy(state);
	const [review, setReview] = useState<OutputFile[]>([]);
	const [reports, setReports] = useState<OutputFile[]>([]);

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
			setReview([
				{
					name: "要確認.xlsx",
					note: "直してほしいセルが黄色く塗られています",
					bytes: review,
				},
			]);
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
			setReports([
				{
					name: "日報.xlsx",
					note: "1日・1現場ごとに1枚のシート",
					bytes: result.daily,
				},
				{
					name: "集計表.xlsx",
					note: "延べ人数と作業時間の合計",
					bytes: result.summary,
				},
			]);
			dispatch({ type: "reportDone" });
		} catch (error) {
			dispatch({ type: "reportFailed", message: errorMessage(error) });
		}
	}

	return (
		<div className="min-h-[calc(100dvh-4rem)] bg-surface">
			<div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
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
				<div className="mt-8">
					<Stepper marks={marks} />
				</div>

				<ol className="mt-8 space-y-6">
					<StepCard
						number={1}
						title="見本の日報をダウンロードする"
						mark={sampleMark}
					>
						<p>書き忘れや食い違いを9か所入れた、練習用の日報です。</p>
						<Button onClick={takeSample} className="h-11 px-5 text-base">
							<Download aria-hidden />
							見本をダウンロード
						</Button>
						{state.sampleTaken && (
							<Notice tone="done">
								見本_工事日報.xlsx をダウンロードしました。
							</Notice>
						)}
					</StepCard>

					<StepCard number={2} title="書き忘れを確かめる" mark={checkMark}>
						<p>
							日報を読み込むと、直してほしいセルを黄色く塗った{" "}
							<b>要確認.xlsx</b> が届きます。
						</p>
						<FileDrop
							id="check-file"
							label="日報のExcelを読み込む"
							disabled={busy}
							onFile={check}
						/>
						{state.check.kind === "loading" && <Loading />}
						{state.check.kind === "error" && (
							<Notice tone="error">{state.check.message}</Notice>
						)}
						{state.check.kind === "clean" && (
							<Notice tone="done">
								<p>
									書き忘れや食い違いは見つかりませんでした。要確認.xlsx
									をそのまま手順3に置けます。
								</p>
								<Outputs files={review} />
							</Notice>
						)}
						{state.check.kind === "found" && (
							<div role="status" className="space-y-3">
								<FindingList
									title={`確かめてほしい所が ${state.check.findings.length} か所あります`}
									findings={state.check.findings}
								/>
								<Outputs files={review} />
								<p>要確認.xlsx の黄色いセルを直して保存してください。</p>
							</div>
						)}
					</StepCard>

					<StepCard number={3} title="日報と集計表にまとめる" mark={reportMark}>
						<p>
							直した要確認.xlsx を読み込むと、<b>日報.xlsx</b> と{" "}
							<b>集計表.xlsx</b> が届きます。
						</p>
						<FileDrop
							id="report-file"
							label="直したExcelを読み込む"
							disabled={busy}
							onFile={report}
						/>
						{state.report.kind === "loading" && <Loading />}
						{state.report.kind === "error" && (
							<Notice tone="error">{state.report.message}</Notice>
						)}
						{state.report.kind === "remaining" && (
							<div role="status">
								<FindingList
									title={`まだ ${state.report.findings.length} か所が残っているため、日報と集計表は作りませんでした`}
									findings={state.report.findings}
								/>
							</div>
						)}
						{state.report.kind === "done" && (
							<Notice tone="done">
								<p>日報.xlsx と集計表.xlsx をダウンロードしました。</p>
								<Outputs files={reports} />
							</Notice>
						)}
					</StepCard>
				</ol>

				{/* 一周を終えた瞬間がこのページの成果なので、終わったと分かる区切りを出す */}
				{state.report.kind === "done" && (
					<section
						aria-labelledby="finished-title"
						className="mt-8 rounded-2xl border border-line bg-white px-6 py-8 text-center shadow-sm [word-break:auto-phrase]"
					>
						<CircleCheck
							aria-hidden
							className="mx-auto size-12 text-tape"
							strokeWidth={1.75}
						/>
						<h2 id="finished-title" className="mt-3 text-2xl font-bold">
							一周できました
						</h2>
						<p className="mt-2 text-muted-foreground">
							日報.xlsx と集計表.xlsx ができあがりました。
						</p>
						<div className="mx-auto mt-6 max-w-md border-t border-line pt-5">
							<p className="flex items-center justify-center gap-2 font-medium">
								<LayoutTemplate
									aria-hidden
									className="size-5 shrink-0"
									strokeWidth={1.75}
								/>
								御社の様式に合わせて作れます。
							</p>
							<a
								href={`${REPO}#御社の様式に合わせるとき`}
								className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-brand underline-offset-4 hover:underline"
							>
								様式を合わせるときの説明を見る
								<ArrowRight aria-hidden className="size-4" />
							</a>
						</div>
					</section>
				)}
			</div>
		</div>
	);
}
