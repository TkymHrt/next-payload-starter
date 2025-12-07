# Self-Hosted GitHub Actions Runner Setup Guide

Proxmox サーバー上で GitHub Actions Self-hosted Runner を構築するためのガイドです。

## 📋 前提条件

- Proxmox VE 8.x
- Ubuntu 22.04 LTS VM または LXC コンテナ
- Docker & Docker Compose インストール済み
- GitHub リポジトリへの Admin 権限

## 🚀 Runner セットアップ

### 1. VM/LXC の作成

```bash
# Proxmox上でVM作成（推奨スペック）
# - CPU: 4コア以上
# - RAM: 8GB以上
# - Storage: 50GB SSD以上
```

### 2. 必要なパッケージのインストール

```bash
# システムアップデート
sudo apt update && sudo apt upgrade -y

# 必要なパッケージ
sudo apt install -y \
  curl \
  git \
  jq \
  build-essential \
  libssl-dev \
  libffi-dev \
  python3 \
  python3-pip

# Docker インストール
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose V2
sudo apt install -y docker-compose-plugin

# ユーザーをdockerグループに追加
sudo usermod -aG docker $USER
```

### 3. Node.js インストール

```bash
# Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# pnpm
corepack enable pnpm
```

### 4. GitHub Actions Runner インストール

```bash
# Runnerディレクトリ作成
mkdir -p ~/actions-runner && cd ~/actions-runner

# 最新のRunnerをダウンロード（バージョンは適宜更新）
RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | jq -r '.tag_name' | sed 's/v//')
curl -o actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz -L \
  https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

# 展開
tar xzf ./actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

# 依存関係のインストール
sudo ./bin/installdependencies.sh
```

### 5. Runner の登録

```bash
# GitHubリポジトリ設定 > Actions > Runners > New self-hosted runner から
# トークンを取得して以下を実行

./config.sh --url https://github.com/YOUR_ORG/YOUR_REPO \
  --token YOUR_REGISTRATION_TOKEN \
  --name "proxmox-runner-01" \
  --labels "self-hosted,linux,x64,proxmox" \
  --work "_work"
```

### 6. Systemd サービスとして登録

```bash
# サービスインストール
sudo ./svc.sh install

# サービス開始
sudo ./svc.sh start

# 自動起動有効化
sudo ./svc.sh status
```

## 🔧 Runner のメンテナンス

### ログの確認

```bash
journalctl -u actions.runner.YOUR_ORG-YOUR_REPO.proxmox-runner-01 -f
```

### Runner の更新

```bash
# サービス停止
sudo ./svc.sh stop

# 新しいバージョンをダウンロード・展開
# ...

# サービス再開
sudo ./svc.sh start
```

### Docker キャッシュのクリーンアップ（定期実行推奨）

```bash
# cron設定例（毎日午前3時に実行）
0 3 * * * docker system prune -af --filter "until=168h" >> /var/log/docker-cleanup.log 2>&1
```

## 🛡️ セキュリティ設定

### 1. ファイアウォール設定

```bash
# UFW設定
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw enable
```

### 2. Runner ユーザーの権限制限

```bash
# 専用ユーザー作成
sudo useradd -m -s /bin/bash runner
sudo usermod -aG docker runner

# Runnerディレクトリの所有者変更
sudo chown -R runner:runner /home/runner/actions-runner
```

### 3. Docker のセキュリティ強化

```bash
# /etc/docker/daemon.json
{
  "userns-remap": "default",
  "no-new-privileges": true,
  "live-restore": true,
  "userland-proxy": false,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

## 📊 モニタリング

### リソース監視スクリプト

```bash
#!/bin/bash
# /usr/local/bin/runner-health.sh

CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}')
MEM_USAGE=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')

echo "CPU: ${CPU_USAGE}%, Memory: ${MEM_USAGE}%, Disk: ${DISK_USAGE}%"

# アラート閾値
if (( $(echo "$CPU_USAGE > 90" | bc -l) )); then
  echo "WARNING: High CPU usage"
fi
```

## 🔄 複数 Runner の運用

負荷分散のために複数の Runner を設定する場合：

```bash
# Runner 1
./config.sh --name "proxmox-runner-01" --labels "self-hosted,linux,x64,proxmox"

# Runner 2（別のVMまたはコンテナで）
./config.sh --name "proxmox-runner-02" --labels "self-hosted,linux,x64,proxmox"
```

## 📝 GitHub Secrets 設定

リポジトリの Settings > Secrets and variables > Actions で以下を設定：

### Required Secrets

| Secret Name               | Description                             |
| ------------------------- | --------------------------------------- |
| `DATABASE_URI`            | PostgreSQL 接続文字列                   |
| `PAYLOAD_SECRET`          | Payload CMS シークレット（32 文字以上） |
| `POSTGRES_DB`             | データベース名                          |
| `POSTGRES_USER`           | PostgreSQL ユーザー名                   |
| `POSTGRES_PASSWORD`       | PostgreSQL パスワード                   |
| `CLOUDFLARE_TUNNEL_TOKEN` | Cloudflare Tunnel トークン              |
| `SEMGREP_APP_TOKEN`       | (Optional) Semgrep API トークン         |

### Required Variables

| Variable Name    | Description                      |
| ---------------- | -------------------------------- |
| `DEPLOY_PATH`    | デプロイ先パス（例: `/opt/app`） |
| `PRODUCTION_URL` | 本番環境 URL                     |

## 🎯 トラブルシューティング

### Runner がオフラインになる

```bash
# ステータス確認
sudo ./svc.sh status

# ログ確認
journalctl -u actions.runner.* --since "1 hour ago"

# 再起動
sudo ./svc.sh stop && sudo ./svc.sh start
```

### Docker ビルドが遅い

```bash
# BuildKit キャッシュの確認
docker buildx du

# ディスク使用量の確認
df -h

# 古いイメージの削除
docker image prune -af --filter "until=168h"
```

### Permission denied エラー

```bash
# Docker ソケットの権限確認
ls -la /var/run/docker.sock

# グループ再読み込み
newgrp docker
```
