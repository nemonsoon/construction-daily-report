import { Hero } from "./Hero.tsx";
import { Pains } from "./Pains.tsx";
import { Steps } from "./Steps.tsx";

export function App() {
	return (
		<>
			<Hero />
			<main>
				<Pains />
				<Steps />
			</main>
		</>
	);
}
