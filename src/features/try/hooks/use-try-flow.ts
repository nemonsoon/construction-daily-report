import { useReducer } from "react";
import { FILE_NAME } from "@/config/files.ts";
import {
	makeSampleFile,
	runCheck,
	runReport,
} from "@/features/daily-report/index.ts";
import { download } from "@/lib/download.ts";
import {
	errorMessage,
	flowReducer,
	initialFlow,
	isBusy,
	stepMarks,
} from "../flow.ts";

// 手順の状態と、ファイルを読んで処理を呼び、できたファイルをダウンロードする操作をまとめる。
// 判断は flow.ts の純粋関数に任せ、ここはブラウザとのやり取りだけを持つ
export function useTryFlow() {
	const [state, dispatch] = useReducer(flowReducer, initialFlow);

	async function takeSample() {
		download(await makeSampleFile(), FILE_NAME.sample);
		dispatch({ type: "sampleTaken" });
	}

	async function check(file: File) {
		dispatch({ type: "checkStarted" });
		try {
			const { findings, review } = await runCheck(await file.arrayBuffer());
			download(review, FILE_NAME.review);
			dispatch({ type: "checkFinished", findings, review });
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
			download(result.daily, FILE_NAME.daily);
			download(result.summary, FILE_NAME.summary);
			dispatch({
				type: "reportDone",
				daily: result.daily,
				summary: result.summary,
			});
		} catch (error) {
			dispatch({ type: "reportFailed", message: errorMessage(error) });
		}
	}

	return {
		state,
		marks: stepMarks(state),
		busy: isBusy(state),
		takeSample,
		check,
		report,
	};
}

export type TryFlow = ReturnType<typeof useTryFlow>;
