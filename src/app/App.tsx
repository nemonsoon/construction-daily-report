import { Details } from "./Details.tsx";
import { Hero } from "./Hero.tsx";
import { Pains } from "./Pains.tsx";
import { Showcase } from "./Showcase.tsx";
import { SiteHeader } from "./SiteHeader.tsx";
import { Steps } from "./Steps.tsx";
import { useScreen } from "./useScreen.ts";

export function App() {
	const screen = useScreen();

	return (
		<>
			<SiteHeader screen={screen} />
			<main>
				{/* 画面を外さず隠すだけにして、説明のページへ戻っても手順の結果を残す */}
				<div hidden={screen !== "landing"}>
					<Hero />
					<Pains />
					<Showcase />
					<Details />
				</div>
				<div hidden={screen !== "app"}>
					<Steps />
				</div>
			</main>
			<footer className="border-t border-line">
				<div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
					<p>この試作品は架空のデータだけを使っています。</p>
					<p>
						<a
							href="https://github.com/nemonsoon/construction-daily-report"
							className="underline underline-offset-4 hover:text-foreground"
						>
							GitHub で中身を見る
						</a>
						<span className="mx-2">・</span>MIT License
					</p>
				</div>
			</footer>
		</>
	);
}
