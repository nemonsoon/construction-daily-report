import { createContext, type ReactNode, use } from "react";
import { type TryFlow, useTryFlow } from "./hooks/use-try-flow.ts";

// 手順の部品が、状態と操作を props で受け渡さずに自分で取り出せるようにする。
// 使うのはアプリの画面の中だけなので、アプリ全体には置かない
const TryFlowContext = createContext<TryFlow | null>(null);

export function TryFlowProvider({ children }: { children: ReactNode }) {
	const flow = useTryFlow();
	return <TryFlowContext value={flow}>{children}</TryFlowContext>;
}

export function useTryFlowContext(): TryFlow {
	const flow = use(TryFlowContext);
	if (!flow) throw new Error("TryFlowProvider の外では使えません");
	return flow;
}
