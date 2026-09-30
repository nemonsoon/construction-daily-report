// アプリが出すファイルの名前。変えないと決めた名前なので、書く場所をここ1つにする
export const FILE_NAME = {
	sample: "見本_工事日報.xlsx",
	review: "要確認.xlsx",
	daily: "日報.xlsx",
	summary: "集計表.xlsx",
} as const;

export const XLSX_EXTENSION = ".xlsx";

export const XLSX_MIME_TYPE =
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
