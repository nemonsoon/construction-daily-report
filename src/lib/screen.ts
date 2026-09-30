export type Screen = "landing" | "app";

export const APP_HASH = "#try";
export const LANDING_HASH = "#top";

export const HEADING_ID: Record<Screen, string> = {
	landing: "landing-title",
	app: "app-title",
};

export const DOCUMENT_TITLE: Record<Screen, string> = {
	landing: "日報まとめ｜工事日報の Excel から日報と集計表を作る",
	app: "見本で試す｜日報まとめ",
};

// 印が無いときや知らない印のときは、説明のページを出す
export function screenFromHash(hash: string): Screen {
	return hash === APP_HASH ? "app" : "landing";
}
