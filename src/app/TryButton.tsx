import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { APP_HASH } from "./screen.ts";

type Props = { centered?: boolean; className?: string };

// 説明のページでできる行動はこれだけにする
export function TryButton({ centered = false, className }: Props) {
	return (
		<div className={cn(centered && "text-center", className)}>
			<Button asChild className="h-14 w-full px-8 text-lg sm:w-auto">
				<a href={APP_HASH}>
					見本で試す
					<ChevronRight aria-hidden className="size-5" />
				</a>
			</Button>
			<p
				className={cn(
					"mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground",
					centered && "justify-center",
				)}
			>
				<span>登録不要</span>
				<span>ファイルは外に出ません</span>
			</p>
		</div>
	);
}
