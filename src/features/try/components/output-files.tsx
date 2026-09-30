import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/download.ts";
import type { OutputFile } from "../flow.ts";

// 自動のダウンロードをブラウザが止めても一周が止まらないよう、札ごとに取り直せるようにする
export function OutputFiles({ files }: { files: OutputFile[] }) {
	return (
		<ul className="space-y-3">
			{files.map(({ name, note, bytes }) => (
				<li
					key={name}
					className="flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3"
				>
					<FileSpreadsheet
						aria-hidden
						className="size-6 shrink-0"
						strokeWidth={1.75}
					/>
					<span className="min-w-0 flex-1">
						<span className="block font-bold">{name}</span>
						<span className="block text-sm text-muted-foreground [word-break:auto-phrase]">
							{note}
						</span>
					</span>
					<Button
						variant="outline"
						onClick={() => download(bytes, name)}
						aria-label={`${name} をダウンロード`}
						className="size-11 sm:w-auto sm:px-4"
					>
						<Download aria-hidden />
						{/* スマートフォン幅ではアイコンだけにして、ファイル名と説明の幅を空ける */}
						<span className="hidden sm:inline">ダウンロード</span>
					</Button>
				</li>
			))}
		</ul>
	);
}
