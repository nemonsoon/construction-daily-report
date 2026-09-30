// 画面から処理を使うときの入口。画面はこのファイルだけを読み込み、中のフォルダには直接触れない
export type { Finding } from "./checks/finding.ts";
export { InputFormatError } from "./input/read-input.ts";
export { makeSampleFile, runCheck, runReport } from "./pipeline.ts";
