import { FileSpreadsheet, Upload } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
	id: string;
	label: string;
	disabled: boolean;
	// 今の段のときだけ濃い青にし、今押してほしいボタンを1つに絞る
	primary: boolean;
	onFile: (file: File) => void;
};

export function FileDrop({ id, label, disabled, primary, onFile }: Props) {
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
				"flex cursor-pointer flex-col gap-4 rounded-xl border-2 border-dashed border-line bg-surface p-5 transition-colors sm:flex-row sm:items-center",
				"hover:border-brand/50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
				over && "border-brand bg-brand-soft",
				disabled && "cursor-wait opacity-60",
			)}
		>
			<FileSpreadsheet
				aria-hidden
				className="size-8 shrink-0 text-muted-foreground"
				strokeWidth={1.5}
			/>
			<span className="min-w-0 flex-1">
				<span className="block font-bold">{label}</span>
				<span className="block text-sm text-muted-foreground">
					ここに置くか、ボタンから選ぶ（.xlsx）
				</span>
			</span>
			{/* 見た目だけのボタン。押すと label 全体が input を開く */}
			<span
				aria-hidden="true"
				className={cn(
					"inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-5 font-medium",
					primary
						? "border-transparent bg-primary text-primary-foreground"
						: "border-border bg-background",
				)}
			>
				<Upload className="size-5" />
				ファイルを選ぶ
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
