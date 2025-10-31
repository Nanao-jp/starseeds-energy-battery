#!/usr/bin/env python3
"""
レポート生成スクリプト

直近の変更差分・実行コマンド結果を収集し、
reports/<conversation_id>__<step>__<status>.md を生成します。
"""

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


def get_git_info(base_ref=None, head_ref=None):
    """Git情報を取得
    
    Args:
        base_ref: 比較元のリファレンス（デフォルト: None = HEAD~1を使用）
        head_ref: 比較先のリファレンス（デフォルト: None = HEADを使用）
    
    Returns:
        tuple: (commit_sha, changed_files)
    """
    try:
        # 最新コミットハッシュ
        commit_sha = subprocess.check_output(
            ["git", "rev-parse", "HEAD"],
            text=True
        ).strip()
        
        # 変更されたファイル一覧
        if base_ref or head_ref:
            # 範囲指定がある場合
            base = base_ref if base_ref else "HEAD~1"
            head = head_ref if head_ref else "HEAD"
            
            try:
                changed_files = subprocess.check_output(
                    ["git", "diff", "--name-only", f"{base}..{head}"],
                    text=True,
                    stderr=subprocess.DEVNULL
                ).strip().split("\n")
            except subprocess.CalledProcessError:
                # 範囲指定が失敗した場合はフォールバック
                print(f"⚠️  範囲指定 {base}..{head} が失敗しました。直近コミットを使用します。", file=sys.stderr)
                changed_files = subprocess.check_output(
                    ["git", "diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"],
                    text=True
                ).strip().split("\n")
        else:
            # デフォルト: 直近のコミット
            changed_files = subprocess.check_output(
                ["git", "diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"],
                text=True
            ).strip().split("\n")
        
        # 空行を除去
        changed_files = [f for f in changed_files if f]
        
        return commit_sha, changed_files
    
    except subprocess.CalledProcessError:
        # Gitリポジトリでない、またはコミットがない場合
        return "no-commit-yet", []


def load_project_config():
    """プロジェクト設定を読み込む"""
    config_path = Path(__file__).parent.parent / ".agent" / "project.json"
    
    if not config_path.exists():
        return {}
    
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {}


def load_ci_results():
    """最新のCI結果を読み込む"""
    log_path = Path(__file__).parent.parent / "reports" / ".ci_logs" / "latest.log"
    
    if not log_path.exists():
        return {
            "build": "skipped",
            "test": "skipped",
            "format": "skipped"
        }
    
    # ログから結果を抽出（簡易実装）
    results = {
        "build": "skipped",
        "test": "skipped",
        "format": "skipped"
    }
    
    try:
        with open(log_path, "r", encoding="utf-8") as f:
            content = f.read()
            
            # 簡易的なパース（実際の出力から判断）
            if "Build:" in content:
                if "Build: 成功" in content or "passed" in content.lower():
                    results["build"] = "passed"
                elif "Build: 失敗" in content or "failed" in content.lower():
                    results["build"] = "failed"
            
            if "Test:" in content:
                if "Test: 成功" in content or "passed" in content.lower():
                    results["test"] = "passed"
                elif "Test: 失敗" in content or "failed" in content.lower():
                    results["test"] = "failed"
            
            if "Format:" in content:
                if "Format: 成功" in content or "passed" in content.lower():
                    results["format"] = "passed"
                elif "Format: 失敗" in content or "failed" in content.lower():
                    results["format"] = "failed"
    
    except Exception:
        pass
    
    return results


def format_duration(seconds):
    """秒数をISO 8601 duration形式に変換"""
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"PT{minutes}M{secs}S"


def generate_report(conversation_id, step, status, commit_sha, changed_files, test_results, duration):
    """レポートを生成"""
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    # YAML frontmatter
    frontmatter = f"""---
executor: "cursor"
conversation_id: "{conversation_id}"
step: {step}
status: "{status}"
commit_sha: "{commit_sha}"
changed_files:
"""
    
    if changed_files:
        for file in changed_files:
            frontmatter += f'  - "{file}"\n'
    else:
        frontmatter += "  []\n"
    
    frontmatter += f"""test_results:
  build: "{test_results['build']}"
  test: "{test_results['test']}"
  format: "{test_results['format']}"
duration: "{duration}"
timestamp: "{timestamp}"
---
"""
    
    # 本文
    body = f"""
# レポート: {conversation_id} - Step {step}

## ✅ 実行内容の要約

ステップ {step} を実行しました。

ステータス: **{status.upper()}**

## 📝 変更内容

### 変更されたファイル ({len(changed_files)}件)

"""
    
    if changed_files:
        for file in changed_files:
            body += f"- `{file}`\n"
    else:
        body += "（変更なし）\n"
    
    body += f"""
## 🧪 テスト結果

- **Build**: {test_results['build']}
- **Test**: {test_results['test']}
- **Format**: {test_results['format']}

## 📊 統計

- **実行時間**: {duration}
- **変更ファイル数**: {len(changed_files)}
- **コミットハッシュ**: `{commit_sha}`

## 💡 次のステップへの推奨事項

"""
    
    if status == "success":
        body += "正常に完了しました。次のステップに進むことができます。\n"
    else:
        body += "エラーが発生しました。ログを確認して修正が必要です。\n"
    
    body += f"""
---

**生成日時**: {timestamp}
"""
    
    return frontmatter + body


def main():
    """メイン処理"""
    parser = argparse.ArgumentParser(
        description="Cursor→HQ レポート生成スクリプト"
    )
    parser.add_argument(
        "--conversation-id",
        help="会話ID（デフォルト: auto-generated）"
    )
    parser.add_argument(
        "--step",
        type=int,
        default=1,
        help="ステップ番号（デフォルト: 1）"
    )
    parser.add_argument(
        "--status",
        choices=["success", "failed"],
        default="success",
        help="実行ステータス（デフォルト: success）"
    )
    parser.add_argument(
        "--duration",
        type=int,
        default=0,
        help="実行時間（秒）（デフォルト: 0）"
    )
    parser.add_argument(
        "--base-ref",
        help="比較元のGitリファレンス（デフォルト: HEAD~1）"
    )
    parser.add_argument(
        "--head-ref",
        help="比較先のGitリファレンス（デフォルト: HEAD）"
    )
    
    args = parser.parse_args()
    
    # Git情報取得
    commit_sha, changed_files = get_git_info(
        base_ref=args.base_ref,
        head_ref=args.head_ref
    )
    
    # プロジェクト設定読み込み
    config = load_project_config()
    
    # conversation_id のデフォルト値
    if args.conversation_id:
        conversation_id = args.conversation_id
    else:
        conversation_id = config.get("name", "default") + "-report"
    
    # CI結果読み込み
    test_results = load_ci_results()
    
    # Duration フォーマット
    duration = format_duration(args.duration)
    
    # レポート生成
    report_content = generate_report(
        conversation_id=conversation_id,
        step=args.step,
        status=args.status,
        commit_sha=commit_sha,
        changed_files=changed_files,
        test_results=test_results,
        duration=duration
    )
    
    # レポート保存
    reports_dir = Path(__file__).parent.parent / "reports"
    reports_dir.mkdir(exist_ok=True)
    
    report_filename = f"{conversation_id}__{args.step}__{args.status}.md"
    report_path = reports_dir / report_filename
    
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_content)
    
    print(f"✅ レポートを生成しました: {report_path}")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())

