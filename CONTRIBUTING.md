# Contributing Guide / コントリビューションガイド

## 開発を始める

### 環境構築

```bash
# リポジトリをクローン
git clone <repository-url>
cd <project-name>

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
docker compose up -d  # PostgreSQL
pnpm dev
```

### 必要な環境変数

`.env` ファイルを作成し、必要な環境変数を設定してください：

```env
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/payload
PAYLOAD_SECRET=your-secret-key-minimum-32-characters
```

## 開発フロー

### 1. Issue の確認・作成

- 作業を始める前に、関連する Issue があるか確認してください
- 新しい機能やバグ修正の場合は、まず Issue を作成してください
- Issue テンプレートを使用してください

### 2. ブランチの作成

```bash
# main ブランチを最新に
git checkout main
git pull origin main

# 作業ブランチを作成
git checkout -b <type>/<issue-number>-<short-description>
```

**ブランチ命名規則:**

| Type        | 用途                       |
| ----------- | -------------------------- |
| `feature/`  | 新機能                     |
| `fix/`      | バグ修正                   |
| `hotfix/`   | 緊急修正                   |
| `refactor/` | リファクタリング           |
| `docs/`     | ドキュメント               |
| `chore/`    | その他（依存関係更新など） |

例: `feature/123-add-user-authentication`

### 3. コードの実装

- コーディング規約に従ってください
- 適切なテストを追加してください
- コミットメッセージは明確に

### 4. コミット

```bash
# コードフォーマット
pnpm run fix

# テスト実行
pnpm run test

# コミット
git add .
git commit -m "<type>: <description>"
```

**コミットメッセージ規約:**

```
<type>: <subject>

[optional body]

[optional footer]
```

| Type       | 説明                                                   |
| ---------- | ------------------------------------------------------ |
| `feat`     | 新機能                                                 |
| `fix`      | バグ修正                                               |
| `docs`     | ドキュメントのみの変更                                 |
| `style`    | コードの意味に影響しない変更（空白、フォーマットなど） |
| `refactor` | バグ修正や機能追加を含まないコード変更                 |
| `perf`     | パフォーマンス改善                                     |
| `test`     | テストの追加・修正                                     |
| `chore`    | ビルドプロセスやツールの変更                           |
| `ci`       | CI/CD の変更                                           |

### 5. Pull Request

- PR テンプレートに従って記入してください
- レビュアーをアサインしてください
- CI が通ることを確認してください

## コードレビュー

### レビュアーへのお願い

- 建設的なフィードバックを心がけてください
- 「なぜ」を説明してください
- 良い点も指摘してください

### 著者へのお願い

- レビューコメントには 24 時間以内に応答してください
- 大きな変更は分割を検討してください
- 議論が長引く場合は同期的なコミュニケーションを

## テスト

```bash
# ユニット・統合テスト
pnpm run test:int

# E2E テスト
pnpm run test:e2e

# 全テスト
pnpm run test
```

## コーディング規約

このプロジェクトは [Ultracite](https://github.com/haydenbleasel/ultracite) を使用しています。

```bash
# コードチェック
pnpm run check

# 自動修正
pnpm run fix
```

## 困ったときは

- Issue で質問してください
- Discussions を活用してください
- チームメンバーに相談してください
