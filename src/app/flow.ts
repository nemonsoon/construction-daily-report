import {
	type Finding,
	InputFormatError,
} from "@/features/daily-report/index.ts";

type Pending =
	| { kind: "idle" }
	| { kind: "loading" }
	| { kind: "error"; message: string };

export type CheckState =
	| Pending
	| { kind: "found"; findings: Finding[] }
	| { kind: "clean" };

export type ReportState =
	| Pending
	| { kind: "remaining"; findings: Finding[] }
	| { kind: "done" };

export type FlowState = {
	sampleTaken: boolean;
	check: CheckState;
	report: ReportState;
};

export type FlowEvent =
	| { type: "sampleTaken" }
	| { type: "checkStarted" }
	| { type: "checkFinished"; findings: Finding[] }
	| { type: "checkFailed"; message: string }
	| { type: "reportStarted" }
	| { type: "reportRemaining"; findings: Finding[] }
	| { type: "reportDone" }
	| { type: "reportFailed"; message: string };

export type StepMark = "todo" | "current" | "done";

export const initialFlow: FlowState = {
	sampleTaken: false,
	check: { kind: "idle" },
	report: { kind: "idle" },
};

export function flowReducer(state: FlowState, event: FlowEvent): FlowState {
	switch (event.type) {
		case "sampleTaken":
			return { ...state, sampleTaken: true };
		case "checkStarted":
			// 手順2をやり直したら、前のファイルから出した手順3の結果は古くなる
			return { ...state, check: { kind: "loading" }, report: { kind: "idle" } };
		case "checkFinished":
			return {
				...state,
				check:
					event.findings.length === 0
						? { kind: "clean" }
						: { kind: "found", findings: event.findings },
			};
		case "checkFailed":
			return { ...state, check: { kind: "error", message: event.message } };
		case "reportStarted":
			return { ...state, report: { kind: "loading" } };
		case "reportRemaining":
			return {
				...state,
				report: { kind: "remaining", findings: event.findings },
			};
		case "reportDone":
			return { ...state, report: { kind: "done" } };
		case "reportFailed":
			return { ...state, report: { kind: "error", message: event.message } };
	}
}

export function stepMarks(state: FlowState): [StepMark, StepMark, StepMark] {
	const reportDone = state.report.kind === "done";
	const done = [
		state.sampleTaken ||
			state.check.kind !== "idle" ||
			state.report.kind !== "idle",
		state.check.kind === "found" || state.check.kind === "clean" || reportDone,
		reportDone,
	];
	const current = done.indexOf(false);
	const mark = (index: number): StepMark =>
		done[index] ? "done" : index === current ? "current" : "todo";
	return [mark(0), mark(1), mark(2)];
}

export function isBusy(state: FlowState): boolean {
	return state.check.kind === "loading" || state.report.kind === "loading";
}

export function errorMessage(error: unknown): string {
	return error instanceof InputFormatError
		? error.message
		: "読み込めませんでした。Excel のファイル（.xlsx）か確かめてください。";
}
