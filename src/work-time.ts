export function workMinutes(
	start: number,
	end: number,
	breakMinutes: number,
): number {
	return end - start - breakMinutes;
}

export function formatClock(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	return `${hours}:${String(rest).padStart(2, "0")}`;
}
