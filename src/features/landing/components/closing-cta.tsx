import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTION_ID } from "@/config/sections.ts";
import { APP_HASH } from "@/lib/screen.ts";
import { Assurances } from "./assurances.tsx";

// 下まで読んだ人が、上へ戻らずに「見本で試す」を押せるようにする
export function ClosingCta() {
	return (
		<section aria-labelledby={SECTION_ID.closing} className="bg-ink text-white">
			<div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
				<h2
					id={SECTION_ID.closing}
					className="text-2xl font-bold tracking-tight sm:text-3xl"
				>
					まずは見本の日報で試してみてください
				</h2>
				<p className="mt-4 text-white/75">
					3つの手順で、日報と集計表ができあがるまでを試せます。
				</p>
				<Button asChild className="mt-8 h-14 px-8 text-lg">
					<a href={APP_HASH}>
						見本で試す
						<ChevronRight aria-hidden className="size-5" />
					</a>
				</Button>
				<Assurances className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-white/60" />
			</div>
		</section>
	);
}
