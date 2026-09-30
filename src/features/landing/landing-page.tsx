import { ChecksSection } from "./components/checks-section.tsx";
import { ClosingCta } from "./components/closing-cta.tsx";
import { FaqSection } from "./components/faq-section.tsx";
import { Hero } from "./components/hero.tsx";
import { HowItWorksSection } from "./components/how-it-works-section.tsx";
import { OutputsSection } from "./components/outputs-section.tsx";

// 主役の「まとめる」を中心に、使い方 → できあがるもの → 見つけるもの の順に並べる
export function LandingPage() {
	return (
		<>
			<Hero />
			<HowItWorksSection />
			<OutputsSection />
			<ChecksSection />
			<FaqSection />
			<ClosingCta />
		</>
	);
}
