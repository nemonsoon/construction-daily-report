import { expect, it } from "vitest";
import { formatFinding } from "../src/finding.ts";

it("行番号・列・文を1行にする", () => {
	expect(
		formatFinding({
			rowNumber: 5,
			column: "現場名",
			message: "「現場名」が空欄です",
		}),
	).toBe("5行目 現場名: 「現場名」が空欄です");
});
