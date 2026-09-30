import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_HASH } from "./screen.ts";

type Props = { className?: string };

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
			<p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
				<span>登録不要</span>
				<span>ファイルはどこにも送りません</span>
			</p>
		</div>
	);
}
