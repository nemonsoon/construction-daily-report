# 手元で動かす

日報まとめを自分のパソコンで動かし、直して、公開するまでの手順です。
作りの全体は [作りの説明](architecture.md) にあります。

## 必要なもの

- Node.js と pnpm。どちらも必要な版は `package.json` に書いてあります（Node.js は `engines`、pnpm は `packageManager`）

## 準備

リポジトリの中で次を実行します。
依存を入れ、Git のフックを入れます。

```bash
pnpm install
pnpm exec lefthook install
```

フックは、コミットの前に Biome で整形と lint を行い、push の前にテストを走らせます（中身は `lefthook.yml`）。
lefthook は `pnpm install` のときに自分でフックを入れないようにしてあるので（`pnpm-workspace.yaml` の `allowBuilds`）、2つ目のコマンドで入れます。

## よく使うコマンド

コマンドの中身は `package.json` の `scripts` が正本です。

| コマンド | すること |
| --- | --- |
| `pnpm dev` | 開発用のサーバを起動する。表示された住所をブラウザで開く |
| `pnpm test` | テストを走らせる |
| `pnpm typecheck` | 型を確かめる |
| `pnpm lint` | 整形と lint を確かめる |
| `pnpm build` | 型を確かめたうえで、公開するファイルを `dist/` に作る |

型を確かめるときは `pnpm typecheck` を使います。
`tsc -b` を直接走らせると、git で管理しない `tsconfig.tsbuildinfo` ができます。

## 公開の仕組み

`main` に push すると、GitHub Actions（`.github/workflows/pages.yml`）が依存を入れ、テストと build を通したうえで、`dist/` を GitHub Pages に置き換えます。
テストか build が落ちると、公開中のページは前の版のまま残ります。

`package.json` の `packageManager` を変えたら、`pnpm install` でロックファイルも更新してから push します。
GitHub Actions はロックファイルと食い違うと install を止めます（`--frozen-lockfile`）。
