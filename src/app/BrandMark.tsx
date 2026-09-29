type Props = { className?: string };

// ロゴの印（日報の紙とチェック）。色は文字の色を引き継ぐ
export function BrandMark({ className }: Props) {
	return (
		<svg
			viewBox="0 0 64 64"
			fill="none"
			stroke="currentColor"
			strokeWidth={4}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className={className}
		>
			<path d="M14 8h25l11 11v35a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z" />
			<path d="M39 8v11h11M21 29h19M21 37h11" />
			<path d="m21 47 5 5 11-13" />
		</svg>
	);
}
