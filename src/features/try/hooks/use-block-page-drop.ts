import { useEffect } from "react";

// 受け取り枠の外にファイルを落とすと、ブラウザがそのファイルを開いてページが消えるため止める
export function useBlockPageDrop() {
	useEffect(() => {
		const stop = (event: DragEvent) => event.preventDefault();
		window.addEventListener("dragover", stop);
		window.addEventListener("drop", stop);
		return () => {
			window.removeEventListener("dragover", stop);
			window.removeEventListener("drop", stop);
		};
	}, []);
}
