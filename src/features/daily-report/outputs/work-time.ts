export function workMinutes(
	start: number,
	end: number,
	breakMinutes: number,
): number {
	return end - start - breakMinutes;
}

// 1440分以上は翌日の時刻として「翌6:00」と書く
export function formatClock(minutes: number): string {
	const nextDay = minutes >= 1440;
	const clock = nextDay ? minutes - 1440 : minutes;
	const hours = Math.floor(clock / 60);
	const rest = clock % 60;
	return `${nextDay ? "翌" : ""}${hours}:${String(rest).padStart(2, "0")}`;
}
