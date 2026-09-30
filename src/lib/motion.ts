// 動きを減らす設定の人には、なめらかに動かさず一度で移る
export function preferredScrollBehavior(): ScrollBehavior {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches
		? "auto"
		: "smooth";
}
