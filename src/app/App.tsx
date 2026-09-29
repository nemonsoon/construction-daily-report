import { ChecksSection } from "./ChecksSection.tsx";
import { Hero } from "./Hero.tsx";
import { OutputsSection } from "./OutputsSection.tsx";
import { SiteFooter } from "./SiteFooter.tsx";
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
					<ChecksSection />
					<OutputsSection />
				</div>
				<div hidden={screen !== "app"}>
					<Steps />
				</div>
			</main>
			<SiteFooter />
		</>
	);
}
