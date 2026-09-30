import { describe, expect, it } from "vitest";
import type { Finding } from "@/features/daily-report/checks/finding.ts";
import { InputFormatError } from "@/features/daily-report/input/read-input.ts";
import {
	errorMessage,
	type FlowEvent,
	type FlowState,
	flowReducer,
	initialFlow,
	isBusy,
	stepMarks,
} from "./flow.ts";

const finding: Finding = {
	rowNumber: 3,
	column: "現場名",
	message: "「現場名」が空欄です",
};

function run(...events: FlowEvent[]): FlowState {
	return events.reduce(flowReducer, initialFlow);
}

describe("stepMarks", () => {
	it("はじめは手順1が今の段", () => {
		expect(stepMarks(initialFlow)).toEqual(["current", "todo", "todo"]);
	});

	it("見本を取ると手順2へ進む", () => {
		expect(stepMarks(run({ type: "sampleTaken" }))).toEqual([
			"done",
			"current",
			"todo",
		]);
	});

	it("見本を取らずに手元の日報を置いても、手順1は終わった扱いにする", () => {
		expect(
			stepMarks(
				run(
					{ type: "checkStarted" },
					{ type: "checkFinished", findings: [finding] },
				),
			),
		).toEqual(["done", "done", "current"]);
	});

	it("手順2で読めなかったら、手順2のまま", () => {
		expect(
			stepMarks(
				run({ type: "checkStarted" }, { type: "checkFailed", message: "x" }),
			),
		).toEqual(["done", "current", "todo"]);
	});

	it("指摘が残っていたら、手順3のまま", () => {
		const state = run(
			{ type: "checkStarted" },
			{ type: "checkFinished", findings: [finding] },
			{ type: "reportStarted" },
			{ type: "reportRemaining", findings: [finding] },
		);
		expect(stepMarks(state)).toEqual(["done", "done", "current"]);
	});

	it("日報と集計表を出したら、すべて終わる", () => {
		const state = run(
			{ type: "checkStarted" },
			{ type: "checkFinished", findings: [finding] },
			{ type: "reportStarted" },
			{ type: "reportDone" },
		);
		expect(stepMarks(state)).toEqual(["done", "done", "done"]);
	});

	it("直した要確認.xlsx を手順3にいきなり置いて通っても、すべて終わる", () => {
		expect(
			stepMarks(run({ type: "reportStarted" }, { type: "reportDone" })),
		).toEqual(["done", "done", "done"]);
	});
});

describe("flowReducer", () => {
	it("指摘が0件なら、手順2は見つからなかった扱い", () => {
		expect(
			run({ type: "checkStarted" }, { type: "checkFinished", findings: [] })
				.check,
		).toEqual({ kind: "clean" });
	});

	it("手順2をやり直すと、前の手順3の結果を消す", () => {
		const state = run(
			{ type: "checkStarted" },
			{ type: "checkFinished", findings: [] },
			{ type: "reportStarted" },
			{ type: "reportDone" },
			{ type: "checkStarted" },
		);
		expect(state.report).toEqual({ kind: "idle" });
	});
});

describe("isBusy", () => {
	it("どちらかの段が処理中のあいだだけ、忙しい扱い", () => {
		expect(isBusy(initialFlow)).toBe(false);
		expect(isBusy(run({ type: "checkStarted" }))).toBe(true);
		expect(isBusy(run({ type: "reportStarted" }))).toBe(true);
		expect(
			isBusy(
				run({ type: "checkStarted" }, { type: "checkFinished", findings: [] }),
			),
		).toBe(false);
	});
});

describe("errorMessage", () => {
	it("入力の形の誤りは、その文をそのまま出す", () => {
		expect(errorMessage(new InputFormatError("「日付」の列がありません"))).toBe(
			"「日付」の列がありません",
		);
	});

	it("それ以外は、Excel のファイルか確かめるよう促す", () => {
		expect(errorMessage(new Error("zip"))).toBe(
			"読み込めませんでした。Excel のファイル（.xlsx）か確かめてください。",
		);
	});
});
