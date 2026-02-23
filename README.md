## サービス名
学習記録帳兼ReactSandbox

## サービス概要
- 学習内容、学習時間の計測をすることができる
- 私専用のReact, CI/CD, specなどあらゆることで好きなことしてOKなリポジトリ

## 環境設定方法

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd sample-vite
```

### 2. パッケージのインストール
```bash
npm install
```

### 3. 環境変数の設定
`.env.sample` をコピーして `.env` ファイルを作成する。
```bash
cp .env.sample .env
```

[Supabase](https://supabase.com/) でプロジェクトを作成し、取得した値を `.env` に設定する。

| 変数名 | 説明 |
|---|---|
| `VITE_SUPABASE_URL` | SupabaseプロジェクトのURL |
| `VITE_SUPABASE_ANON_KEY` | Supabaseのanon key |

### 4. 開発サーバーの起動
```bash
npm run dev
```

### その他のコマンド
| コマンド | 説明 |
|---|---|
| `npm run build` | プロダクションビルド |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run lint` | ESLintによる静的解析 |
| `npm test` | Jestによるテスト実行 |
