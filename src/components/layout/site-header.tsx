import { ChevronLeft, ChevronRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark.tsx";
import { Button } from "@/components/ui/button";
import { APP_HASH, LANDING_HASH, type Screen } from "@/lib/screen.ts";

export function SiteHeader({ screen }: { screen: Screen }) {
	return (
		<header className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
				<a
					href={LANDING_HASH}
					className="flex min-h-11 items-center gap-2 rounded-lg text-xl font-bold tracking-tight text-brand"
				>
					<BrandMark className="size-8" />
					日報まとめ
				</a>
				{screen === "landing" ? (
					<Button asChild className="h-11 px-4 text-base">
						<a href={APP_HASH}>
							見本で試す
							<ChevronRight aria-hidden />
						</a>
					</Button>
				) : (
					<Button asChild variant="outline" className="h-11 px-4 text-base">
						<a href={LANDING_HASH}>
							<ChevronLeft aria-hidden />
							説明に戻る
						</a>
					</Button>
				)}
			</div>
		</header>
	);
}
