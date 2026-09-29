import "@fontsource/dela-gothic-one/400.css";
import "@fontsource/zen-kaku-gothic-new/400.css";
import "@fontsource/zen-kaku-gothic-new/500.css";
import "@fontsource/zen-kaku-gothic-new/700.css";
import "@fontsource/biz-udgothic/400.css";
import "@fontsource/biz-udgothic/700.css";
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App.tsx";

const root = document.getElementById("root");
if (!root) throw new Error("#root がありません");

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
