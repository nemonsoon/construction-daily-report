import { CircleCheck, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

const TONES = {
	done: "bg-tape-soft",
	error: "border-l-4 border-destructive/40 bg-destructive/5 text-destructive",
	plain: "border border-line bg-white",
};

export function Notice({
	tone,
	children,
}: {
	tone: keyof typeof TONES;
	children: ReactNode;
}) {
	return (
		// 読めなかった知らせは、読み上げの途中でも割り込んで伝える
		<div
			role={tone === "error" ? "alert" : "status"}
			className={`rounded-xl px-4 py-3 [word-break:auto-phrase] ${TONES[tone]}`}
		>
			{tone === "done" ? (
				<div className="flex items-start gap-2">
					<CircleCheck
						aria-hidden
						className="mt-0.5 size-5 shrink-0 text-tape"
					/>
					<div className="min-w-0 flex-1 space-y-3">{children}</div>
				</div>
			) : (
				children
			)}
		</div>
	);
}

export function Loading() {
	return (
		<Notice tone="plain">
			<span className="inline-flex items-center gap-2">
				<Loader2
					aria-hidden
					className="size-4 animate-spin motion-reduce:animate-none"
				/>
				読み込んでいます…
			</span>
		</Notice>
	);
}
