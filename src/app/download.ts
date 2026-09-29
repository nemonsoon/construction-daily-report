const XLSX_TYPE =
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export function download(bytes: Uint8Array<ArrayBuffer>, name: string): void {
	const url = URL.createObjectURL(new Blob([bytes], { type: XLSX_TYPE }));
	const link = document.createElement("a");
	link.href = url;
	link.download = name;
	link.click();
	// すぐに消すとダウンロードが始まる前に取り消されるブラウザがあるため、少し待つ
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}
