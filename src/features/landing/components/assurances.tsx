import { Check, Lock } from "lucide-react";

// 冒頭と締めの帯で、押す前の心配（登録・ファイルの送り先）に答える一行
export function Assurances({ className }: { className?: string }) {
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
