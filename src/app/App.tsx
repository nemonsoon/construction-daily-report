import { Details } from "./Details.tsx";
import { Hero } from "./Hero.tsx";
import { Pains } from "./Pains.tsx";
import { Showcase } from "./Showcase.tsx";
import { Steps } from "./Steps.tsx";

export function App() {
	return (
		<>
			<Hero />
			<main>
				<Pains />
				<Steps />
				<Showcase />
				<Details />
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
