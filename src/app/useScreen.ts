import { useEffect, useRef, useState } from "react";
import {
	DOCUMENT_TITLE,
	HEADING_ID,
	type Screen,
	screenFromHash,
} from "./screen.ts";

export function useScreen(): Screen {
	const [screen, setScreen] = useState(() =>
		screenFromHash(window.location.hash),
	);
	// 最初の表示では見出しへ移らない。印が変わって画面を切り替えたときだけ移る
	const switched = useRef(false);

	useEffect(() => {
		const onHashChange = () => {
			switched.current = true;
			setScreen(screenFromHash(window.location.hash));
		};
		window.addEventListener("hashchange", onHashChange);
		return () => window.removeEventListener("hashchange", onHashChange);
	}, []);

	useEffect(() => {
		document.title = DOCUMENT_TITLE[screen];
		if (!switched.current) return;
		switched.current = false;
		window.scrollTo(0, 0);
		document.getElementById(HEADING_ID[screen])?.focus();
	}, [screen]);

	return screen;
}
