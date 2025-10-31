# HQ Watcher - prompts/ 監視と自動化ガイド

`scripts/hq_watcher.py` は、Agent HQからの新しいプロンプトを自動検知するための監視スクリプトです。

## 📋 概要

### 役割

1. **origin/main を定期的に fetch**
2. **prompts/ ディレクトリの新規ファイルを検知**
3. **最後に処理したファイルを記録**（`.agent/state/last_seen_prompt.json`）
4. **新規プロンプトを通知**（標準出力にパスを出力）

### 現在の機能範囲

- ✅ ファイル検知と通知
- ✅ 状態管理（重複検知の回避）
- ❌ Cursor への自動投入（**現時点では範囲外**）
- ❌ UI操作の自動化（**拡張ポイント**）

## 🚀 基本的な使い方

### 手動ワンショット実行

```bash
python scripts/hq_watcher.py --once
```

**出力例:**
```
============================================================
👁️  HQ Watcher 起動
============================================================
📂 監視対象: prompts/
⏱️  間隔: 60秒
🔄 自動トリガー: 無効
============================================================

[15:22:25] ✅ fetch完了
🆕 新規プロンプト検知: feature-auth__1.md
📄 パス: prompts/feature-auth__1.md
```

### 継続監視モード

```bash
# 60秒間隔で監視（デフォルト）
python scripts/hq_watcher.py

# カスタム間隔（例: 30秒）
python scripts/hq_watcher.py --interval 30
```

**注意**: 継続監視には `.agent/project.json` で `auto_trigger: true` の設定が必要です。

## 🔧 OS別の軽量自動トリガ例

以下はOS標準機能を使った軽量な自動化例です。**自己責任で利用**してください。

### macOS: launchd

**~/Library/LaunchAgents/com.hq.watcher.plist**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" 
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.hq.watcher</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>/path/to/your/project/scripts/hq_watcher.py</string>
        <string>--once</string>
    </array>
    
    <key>StartInterval</key>
    <integer>60</integer>
    
    <key>WorkingDirectory</key>
    <string>/path/to/your/project</string>
    
    <key>StandardOutPath</key>
    <string>/tmp/hq-watcher.log</string>
    
    <key>StandardErrorPath</key>
    <string>/tmp/hq-watcher.err</string>
</dict>
</plist>
```

**登録・起動:**
```bash
# plistファイルを編集（パスを実際のプロジェクトパスに置き換え）
launchctl load ~/Library/LaunchAgents/com.hq.watcher.plist
launchctl start com.hq.watcher

# 停止
launchctl stop com.hq.watcher
launchctl unload ~/Library/LaunchAgents/com.hq.watcher.plist
```

**Automator/AppleScript 代替案:**

Automatorで「アプリケーション」を作成し、シェルスクリプトアクションを追加：

```bash
cd /path/to/your/project
/usr/bin/python3 scripts/hq_watcher.py --once
```

ログイン項目に登録すると起動時に実行されます。

---

### Linux: systemd (user service)

**~/.config/systemd/user/hq-watcher.service**

```ini
[Unit]
Description=HQ Watcher - prompts/ monitoring
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/your/project
ExecStart=/usr/bin/python3 /path/to/your/project/scripts/hq_watcher.py --once
Restart=no

[Install]
WantedBy=default.target
```

**~/.config/systemd/user/hq-watcher.timer**

```ini
[Unit]
Description=HQ Watcher Timer

[Timer]
OnBootSec=1min
OnUnitActiveSec=1min
Persistent=true

[Install]
WantedBy=timers.target
```

**有効化・起動:**
```bash
# サービス・タイマーをリロード
systemctl --user daemon-reload

# タイマーを有効化・起動
systemctl --user enable hq-watcher.timer
systemctl --user start hq-watcher.timer

# ステータス確認
systemctl --user status hq-watcher.timer
systemctl --user list-timers

# 停止
systemctl --user stop hq-watcher.timer
systemctl --user disable hq-watcher.timer
```

**cron 代替案:**

```bash
# crontabを編集
crontab -e

# 1分ごとに実行
* * * * * cd /path/to/your/project && /usr/bin/python3 scripts/hq_watcher.py --once >> /tmp/hq-watcher.log 2>&1
```

---

### Windows: Task Scheduler

**PowerShell スクリプト (run-watcher.ps1):**

```powershell
Set-Location "C:\path\to\your\project"
& python scripts\hq_watcher.py --once
```

**Task Scheduler 登録 (schtasks コマンド):**

```powershell
# 1分ごとに実行するタスクを作成
schtasks /Create `
  /TN "HQWatcher" `
  /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\path\to\run-watcher.ps1" `
  /SC MINUTE `
  /MO 1 `
  /RU "%USERNAME%"

# タスク確認
schtasks /Query /TN "HQWatcher"

# タスク削除
schtasks /Delete /TN "HQWatcher" /F
```

**PowerShell ScheduledJob 代替案:**

```powershell
# ScheduledJobを作成
$trigger = New-JobTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration ([TimeSpan]::MaxValue)

$option = New-ScheduledJobOption -StartIfOnBattery -ContinueIfGoingOnBattery

Register-ScheduledJob `
  -Name "HQWatcher" `
  -Trigger $trigger `
  -ScheduledJobOption $option `
  -ScriptBlock {
    Set-Location "C:\path\to\your\project"
    & python scripts\hq_watcher.py --once
  }

# Job確認
Get-ScheduledJob

# Job削除
Unregister-ScheduledJob -Name "HQWatcher"
```

---

## ⚙️ 設定

### .agent/project.json

```json
{
  "auto_trigger": false,  // 継続監視を有効化する場合は true
  ...
}
```

### 状態ファイル

`.agent/state/last_seen_prompt.json` (自動生成、gitignore済み)

```json
{
  "last_prompt": "prompts/feature-auth__1.md",
  "last_check": "2025-10-31T12:34:56.789Z"
}
```

## 🔮 将来の拡張ポイント

現在のwatcherは**通知まで**で、以下は実装されていません：

### 1. Cursor への自動投入

Cursorのチャット画面にプロンプト内容を自動注入するには、以下の方法が考えられます：

- **Cursor API** (公式サポート待ち)
- **クリップボード経由**: `pbcopy` (macOS) / `xclip` (Linux) / `clip.exe` (Windows)
- **UI自動化**: AppleScript (macOS) / xdotool (Linux) / AutoHotkey (Windows)

**サンプル（macOS）:**
```bash
# プロンプト内容をクリップボードにコピー
cat prompts/feature-auth__1.md | pbcopy

# 通知を表示
osascript -e 'display notification "新しいプロンプトがあります" with title "HQ Watcher"'
```

### 2. 通知の高度化

- **デスクトップ通知**: `notify-send` (Linux) / `osascript` (macOS) / `BurntToast` (Windows)
- **Slack/Discord通知**: Webhook経由
- **メール通知**: smtplib利用

### 3. GitHub Actions連携

prompts/の変更をトリガーにGitHub Actionsで通知する例（フル運用寄り）：

```yaml
name: Notify New Prompt
on:
  push:
    paths:
      - 'prompts/*.md'
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Notify
        run: echo "New prompt detected"
```

## 📌 重要な注意事項

### セキュリティ

- **パス・認証情報**: スクリプトや設定ファイルに認証情報を直接書かない
- **権限**: タスク実行ユーザーの権限を最小限に
- **ログ**: 機密情報がログに含まれないよう注意

### 運用方針

本テンプレートの既定運用は**最小手動（コピペ投入）**です：

1. watcherが新規プロンプトを検知
2. ログ/通知で確認
3. **手動で** Cursorにコピペして実装開始

自動化は各プロジェクトの要件に応じて段階的に導入してください。

### トラブルシューティング

**問題: watcherが動作しない**

```bash
# 手動実行してエラー確認
python scripts/hq_watcher.py --once

# Gitリポジトリ内で実行しているか確認
git status

# origin/main が存在するか確認
git remote -v
git branch -r
```

**問題: 状態ファイルが壊れた**

```bash
# 状態ファイルを削除（次回実行時に再生成）
rm .agent/state/last_seen_prompt.json
```

**問題: タスクスケジューラが起動しない**

- パスが絶対パスになっているか確認
- 実行ユーザーの権限を確認
- ログファイルでエラー内容を確認

---

## 📚 参考リンク

- **本テンプレートの運用**: [README.md](../README.md)
- **導入ガイド**: [docs/ADOPTION.md](./ADOPTION.md)
- **橋渡しガイド**: [README.bridge.md](../README.bridge.md)

---

**最終更新**: 2025-10-31

