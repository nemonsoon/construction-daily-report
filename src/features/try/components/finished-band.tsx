import { ArrowRight, CircleCheck, LayoutTemplate } from "lucide-react";
import { useEffect, useRef } from "react";
import { FILE_NAME } from "@/config/files.ts";
import { LINK } from "@/config/links.ts";
import { preferredScrollBehavior } from "@/lib/motion.ts";

// 一周を終えた瞬間がこのページの成果なので、終わったと分かる区切りを出す
export function FinishedBand() {
	const band = useRef<HTMLElement>(null);

	// 手順3でファイルを選んだ位置のままだと帯が画面の外に出るため、出たときに帯まで下りる
	useEffect(() => {
		band.current?.scrollIntoView({
			block: "center",
			behavior: preferredScrollBehavior(),
		});
	}, []);

	return (
		<section
			ref={band}
			aria-labelledby="finished-title"
			className="mt-8 rounded-2xl border border-line bg-white px-6 py-8 text-center shadow-sm [word-break:auto-phrase]"
		>
			<CircleCheck
				aria-hidden
				className="mx-auto size-12 text-tape"
				strokeWidth={1.75}
			/>
			<h2 id="finished-title" className="mt-3 text-2xl font-bold">
				日報と集計表ができあがりました
			</h2>
			<p className="mt-2 text-muted-foreground">
				{FILE_NAME.daily} と{FILE_NAME.summary}{" "}
				を開いて、中身を確かめてください。
			</p>
			<div className="mx-auto mt-6 max-w-md border-t border-line pt-5">
				<p className="flex items-center justify-center gap-2 font-medium">
					<LayoutTemplate
						aria-hidden
						className="size-5 shrink-0"
						strokeWidth={1.75}
					/>
					御社の様式に合わせて作れます。
				</p>
				<a
					href={LINK.customForm}
					className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-brand underline-offset-4 hover:underline"
				>
					様式を合わせるときの説明を見る
					<ArrowRight aria-hidden className="size-4" />
				</a>
			</div>
		</section>
	);
}
