export const INPUT_COLUMNS = [
	"日付",
	"現場名",
	"天候",
	"作業員名",
	"開始時刻",
	"終了時刻",
	"休憩(分)",
	"作業内容",
	"安全",
	"備考",
] as const;

export type ColumnName = (typeof INPUT_COLUMNS)[number];

export const REVIEW_COLUMN = "指摘";
