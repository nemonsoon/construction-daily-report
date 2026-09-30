import { describe, expect, it } from "vitest";
import { APP_HASH, LANDING_HASH, screenFromHash } from "./screen.ts";

describe("screenFromHash", () => {
	it("#try ならアプリの画面を出す", () => {
		expect(screenFromHash(APP_HASH)).toBe("app");
	});

	it("印が無ければ説明のページを出す", () => {
		expect(screenFromHash("")).toBe("landing");
	});

	it("#top なら説明のページを出す", () => {
		expect(screenFromHash(LANDING_HASH)).toBe("landing");
	});

	it("知らない印なら説明のページを出す", () => {
		expect(screenFromHash("#details")).toBe("landing");
	});
});
