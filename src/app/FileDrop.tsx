import { FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
	id: string;
	label: string;
	disabled: boolean;
	onFile: (file: File) => void;
};

export function FileDrop({ id, label, disabled, onFile }: Props) {
	const [over, setOver] = useState(false);

	return (
		<label
			htmlFor={id}
			onDragOver={(event) => {
				event.preventDefault();
				if (!disabled) setOver(true);
			}}
			onDragLeave={() => setOver(false)}
			onDrop={(event) => {
				event.preventDefault();
				setOver(false);
				const file = event.dataTransfer.files[0];
				if (file && !disabled) onFile(file);
			}}
			className={cn(
				"flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-line bg-white px-6 py-8 text-center transition-colors",
				"hover:border-ink/40 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
				over && "border-ink bg-surface",
				disabled && "cursor-wait opacity-60",
			)}
		>
			<FileSpreadsheet aria-hidden className="size-8 text-muted-foreground" />
			<span className="font-medium">{label}</span>
			<span className="text-sm text-muted-foreground">
				ここにファイルを置くか、クリックして選ぶ（.xlsx）
			</span>
			<input
				id={id}
				type="file"
				accept=".xlsx"
				className="sr-only"
				disabled={disabled}
				onChange={(event) => {
					const file = event.currentTarget.files?.[0];
					// 同じファイルを直してもう一度選んでも change が起きるように空にする
					event.currentTarget.value = "";
					if (file) onFile(file);
				}}
			/>
		</label>
	);
}
