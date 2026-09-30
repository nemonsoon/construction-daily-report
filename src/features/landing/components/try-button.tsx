import { Check, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_HASH } from "@/lib/screen.ts";

type Props = { className?: string };

// 冒頭と締めの帯で、押す前の心配（登録・ファイルの送り先）に答える一行
export function Assurances({ className }: Props) {
	return (
		<p className={className}>
			<span className="inline-flex items-center gap-1.5">
				<Check aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
				登録不要
			</span>
			<span className="inline-flex items-center gap-1.5">
				<Lock aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
				ファイルはどこにも送りません
			</span>
		</p>
	);
}

// 説明のページでできる行動はこれだけにする
export function TryButton({ className }: Props) {
	return (
		<div className={className}>
			<Button asChild className="h-14 w-full px-8 text-lg sm:w-auto">
				<a href={APP_HASH}>
					見本で試す
					<ChevronRight aria-hidden className="size-5" />
				</a>
			</Button>
			<Assurances className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground" />
		</div>
	);
}
