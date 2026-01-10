# Contributing Guide / コントリビューションガイド

## 対応環境

このプロジェクトは以下の環境での開発をサポートしています：

| 環境 | サポート状況 | 備考 |
| --- | --- | --- |
| **Windows** (Native) | ✅ 対応 | PowerShell または Git Bash を推奨 |
| **Windows** (WSL2) | ✅ 対応 | Ubuntu 22.04+ を推奨 |
| **macOS** | ✅ 対応 | Intel / Apple Silicon 両対応 |
| **Linux** | ✅ 対応 | Ubuntu, Debian, Fedora 等 |

---

## 開発を始める

### 必要なツール

以下のツールが必要です：

1. **Git** - バージョン管理
2. **Docker** + **Docker Compose** - データベースおよび本番環境
3. **mise** - ツールチェーン管理（Node.js, Bun のバージョン固定）

### 環境別セットアップ

<details>
<summary><strong>🪟 Windows (Native)</strong></summary>

#### 1. Git のインストール

[Git for Windows](https://git-scm.com/download/win) をダウンロードしてインストール。

#### 2. Docker Desktop のインストール

1. [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) をダウンロード
2. インストール時に **WSL 2 backend** を有効化
3. インストール後、Docker Desktop を起動

```powershell
# インストール確認
docker --version
docker compose version
```

#### 3. mise のインストール

**PowerShell（管理者権限）で実行：**

```powershell
# Scoop を使用する場合
scoop install mise

# または WinGet を使用する場合
winget install jdx.mise

# インストール後、シェルを再起動してから確認
mise --version
```

**手動インストール：**

[mise Releases](https://github.com/jdx/mise/releases) から最新の `mise-*.exe` をダウンロードし、PATH が通ったディレクトリに配置。

#### 4. シェルの設定

PowerShell で mise を有効化：

```powershell
# PowerShell プロファイルに追加
echo 'mise activate pwsh | Out-String | Invoke-Expression' >> $PROFILE
```

**Git Bash を使用する場合：**

```bash
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
```

</details>

<details>
<summary><strong>🪟 Windows (WSL2)</strong></summary>

#### 1. WSL2 のセットアップ

```powershell
# PowerShell（管理者権限）で実行
wsl --install

# Ubuntu を指定する場合
wsl --install -d Ubuntu
```

再起動後、Ubuntu ターミナルを起動してユーザー設定を完了。

#### 2. Docker Desktop のインストール

1. [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) をダウンロード
2. Settings → Resources → WSL Integration で Ubuntu を有効化

```bash
# WSL 内で確認
docker --version
docker compose version
```

#### 3. mise のインストール

```bash
# WSL の Ubuntu 内で実行
curl https://mise.run | sh

# シェルに追加
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
source ~/.bashrc

mise --version
```

</details>

<details>
<summary><strong>🍎 macOS</strong></summary>

#### 1. Homebrew のインストール（未導入の場合）

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Docker Desktop のインストール

```bash
# Homebrew を使用
brew install --cask docker

# または公式サイトからダウンロード
# https://docs.docker.com/desktop/install/mac-install/
```

Docker Desktop を起動し、Docker アイコンがメニューバーに表示されることを確認。

```bash
docker --version
docker compose version
```

#### 3. mise のインストール

```bash
# Homebrew を使用（推奨）
brew install mise

# または curl を使用
curl https://mise.run | sh

# シェルに追加
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc

mise --version
```

</details>

<details>
<summary><strong>🐧 Linux</strong></summary>

#### 1. Docker のインストール

**Ubuntu / Debian:**

```bash
# 公式リポジトリをセットアップ
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 現在のユーザーを docker グループに追加（sudo なしで実行可能に）
sudo usermod -aG docker $USER
newgrp docker
```

**Fedora:**

```bash
sudo dnf -y install dnf-plugins-core
sudo dnf-3 config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io docker-compose-plugin

sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

#### 2. mise のインストール

```bash
curl https://mise.run | sh

# シェルに追加（bash の場合）
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
source ~/.bashrc

# zsh の場合
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc

mise --version
```

</details>

---

### プロジェクトセットアップ（共通手順）

環境のセットアップが完了したら、以下の手順で開発を開始できます：

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd <project-name>

# 2. mise でツールを信頼してインストール
mise trust
mise install

# 3. 環境変数をセット
cp .env.example .env
# エディタで .env を開き、PAYLOAD_SECRET と DATABASE_URI を編集

# 4. 開発用スタックを起動
mise run dev
```

#### 利用可能なタスク

| コマンド | 説明 |
| --- | --- |
| `mise run dev` | 開発サーバーを起動（DB + Next.js/Payload） |
| `mise run dev:db` | 開発用データベースのみ起動 |
| `mise run dev:db:stop` | 開発用データベースを停止 |
| `mise run reset:db` | 開発データベースをリセット |
| `mise run check` | 環境検証（Docker、設定ファイル） |
| `mise run install` | 依存関係のインストール |
| `mise run prod:up` | 本番環境をビルドして起動 |
| `mise run prod:down` | 本番環境を停止 |
| `mise run reset:db:prod` | 本番用データベースをリセット |

---

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
bunx ultracite fix

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

- 大きな変更は分割を検討してください
- 議論が長引く場合は同期的なコミュニケーションを

## コーディング規約

このプロジェクトは [Ultracite](https://github.com/haydenbleasel/ultracite) を使用しています。

```bash
# コードチェック
bun run check

# 自動修正
bun run fix
```

## トラブルシューティング

### mise 関連

<details>
<summary><strong>mise コマンドが見つからない</strong></summary>

シェルの設定ファイルに mise の初期化が追加されているか確認してください：

```bash
# bash の場合
cat ~/.bashrc | grep mise

# zsh の場合
cat ~/.zshrc | grep mise

# PowerShell の場合
cat $PROFILE | Select-String mise
```

設定がない場合は、[環境別セットアップ](#環境別セットアップ)を参照して再設定してください。

</details>

<details>
<summary><strong>mise trust エラー</strong></summary>

プロジェクトディレクトリで `.mise.toml` を信頼する必要があります：

```bash
mise trust
mise install
```

それでもエラーが出る場合は、キャッシュをクリアしてみてください：

```bash
mise cache clear
mise install
```

</details>

<details>
<summary><strong>bun / node コマンドが見つからない</strong></summary>

mise でツールがインストールされていない可能性があります：

```bash
mise install

# インストールされているツールを確認
mise ls
```

</details>

### Docker 関連

<details>
<summary><strong>Docker が起動していない</strong></summary>

**Windows / macOS:**

Docker Desktop アプリケーションを起動してください。タスクトレイ（Windows）またはメニューバー（macOS）にクジラのアイコンが表示されていることを確認。

**Linux:**

```bash
sudo systemctl start docker
sudo systemctl status docker
```

</details>

<details>
<summary><strong>docker compose コマンドが見つからない</strong></summary>

Docker Compose V2 がインストールされていることを確認してください：

```bash
docker compose version
```

古い `docker-compose`（ハイフン付き）コマンドは非推奨です。Docker を最新版にアップデートしてください。

</details>

<details>
<summary><strong>権限エラー（Linux）</strong></summary>

`permission denied` エラーが出る場合、ユーザーが docker グループに所属していない可能性があります：

```bash
sudo usermod -aG docker $USER
newgrp docker

# または一度ログアウトして再ログイン
```

</details>

<details>
<summary><strong>ポートが使用中</strong></summary>

`port is already allocated` エラーが出る場合、別のプロセスがポートを使用しています：

```bash
# 使用中のポートを確認（例：5432）
# Linux / macOS
lsof -i :5432

# Windows PowerShell
netstat -ano | findstr :5432
```

該当プロセスを停止するか、`.env` でポート番号を変更してください。

</details>

### 環境固有の問題

<details>
<summary><strong>Windows: 改行コードの問題</strong></summary>

Git で CRLF/LF の変換設定を確認してください：

```bash
git config core.autocrlf
```

推奨設定：

```bash
# Windows
git config --global core.autocrlf true

# WSL / macOS / Linux
git config --global core.autocrlf input
```

</details>

<details>
<summary><strong>Windows: パスが長すぎるエラー</strong></summary>

長いパス名を有効にしてください：

```powershell
# 管理者権限の PowerShell で実行
git config --global core.longpaths true
```

</details>

<details>
<summary><strong>WSL: ファイルシステムのパフォーマンス</strong></summary>

WSL では、Windows ファイルシステム（`/mnt/c/...`）へのアクセスが遅くなります。プロジェクトは WSL 内のファイルシステム（`~/projects/...` など）に配置することを推奨します。

```bash
# 推奨：WSL 内にクローン
cd ~
mkdir projects
cd projects
git clone <repository-url>
```

</details>

<details>
<summary><strong>macOS: Rosetta 関連のエラー（Apple Silicon）</strong></summary>

一部のツールが x86_64 アーキテクチャを必要とする場合があります。Rosetta 2 をインストールしてください：

```bash
softwareupdate --install-rosetta
```

</details>

---

## 困ったときは

- Slack で質問してください
- チームメンバーに相談してください
- `mise run check` で環境の問題を診断できます
