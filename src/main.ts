import { formatFinding } from "./finding.ts";
import { runCheck, runReport } from "./pipeline.ts";
import { InputFormatError } from "./read-input.ts";
import { makeSampleWorkbook } from "./sample-data.ts";
import { toBytes } from "./sheet.ts";

const XLSX_TYPE =
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function element<T extends HTMLElement>(id: string): T {
	const found = document.getElementById(id);
	if (!found) throw new Error(`#${id} がありません`);
	return found as T;
}

const status = element<HTMLUListElement>("status");

function show(lines: string[]): void {
	status.replaceChildren(
		...lines.map((line) => {
			const item = document.createElement("li");
			item.textContent = line;
			return item;
		}),
	);
}

function download(bytes: Uint8Array<ArrayBuffer>, name: string): void {
	const url = URL.createObjectURL(new Blob([bytes], { type: XLSX_TYPE }));
	const link = document.createElement("a");
	link.href = url;
	link.download = name;
	link.click();
	// すぐに消すとダウンロードが始まる前に取り消されるブラウザがあるため、少し待つ
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function onFile(
	id: string,
	handle: (data: ArrayBuffer) => Promise<void>,
): void {
	const input = element<HTMLInputElement>(id);
	input.addEventListener("change", async () => {
		const file = input.files?.[0];
		if (!file) return;
		show(["読み込んでいます…"]);
		try {
			await handle(await file.arrayBuffer());
		} catch (error) {
			show([
				error instanceof InputFormatError
					? error.message
					: "読み込めませんでした。Excel のファイル（.xlsx）か確かめてください。",
			]);
		} finally {
			// 同じファイルを直してもう一度選んでも change が起きるように空にする
			input.value = "";
		}
	});
}

element<HTMLButtonElement>("sample").addEventListener("click", async () => {
	download(await toBytes(makeSampleWorkbook().workbook), "見本_工事日報.xlsx");
});

onFile("check-file", async (data) => {
	const { findings, review } = await runCheck(data);
	download(review, "要確認.xlsx");
	show(
		findings.length === 0
			? [
					"書き忘れや食い違いは見つかりませんでした。要確認.xlsx をそのまま手順2で選べます。",
				]
			: [
					`確かめてほしい所が ${findings.length} か所あります。要確認.xlsx の黄色いセルを直してください。`,
					...findings.map(formatFinding),
				],
	);
});

onFile("report-file", async (data) => {
	const result = await runReport(data);
	if (!result.ok) {
		show([
			`まだ ${result.findings.length} か所が残っているため、日報と集計表は作りませんでした。`,
			...result.findings.map(formatFinding),
		]);
		return;
	}
	download(result.daily, "日報.xlsx");
	download(result.summary, "集計表.xlsx");
	show(["日報.xlsx と集計表.xlsx をダウンロードしました。"]);
});
