import { SiteFooter } from "@/components/layout/site-footer.tsx";
import { SiteHeader } from "@/components/layout/site-header.tsx";
import { LandingPage } from "@/features/landing/landing-page.tsx";
import { TryPage } from "@/features/try/try-page.tsx";
import { useScreen } from "./use-screen.ts";

export function App() {
	const screen = useScreen();

	return (
		<>
			<SiteHeader screen={screen} />
			<main>
				{/* 画面を外さず隠すだけにして、説明のページへ戻っても手順の結果を残す */}
				<div hidden={screen !== "landing"}>
					<LandingPage />
				</div>
				<div hidden={screen !== "app"}>
					<TryPage />
				</div>
			</main>
			<SiteFooter compact={screen === "app"} />
		</>
	);
}
