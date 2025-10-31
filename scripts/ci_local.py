#!/usr/bin/env python3
"""
ローカルCI実行スクリプト

.agent/project.json の ci.build / ci.test / ci.format を順に実行します。
空文字はスキップし、非0終了で失敗コードを返します。
"""

import json
import os
import subprocess
import sys
from pathlib import Path
from datetime import datetime


def load_project_config():
    """プロジェクト設定を読み込む"""
    config_path = Path(__file__).parent.parent / ".agent" / "project.json"
    
    if not config_path.exists():
        print(f"⚠️  設定ファイルが見つかりません: {config_path}", file=sys.stderr)
        return None
    
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ 設定ファイルのパースに失敗: {e}", file=sys.stderr)
        return None


def ensure_log_dir():
    """ログディレクトリを作成"""
    log_dir = Path(__file__).parent.parent / "reports" / ".ci_logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    return log_dir


def run_command(name, command, log_file):
    """コマンドを実行してログに記録"""
    if not command or command.strip() == "":
        print(f"⏭️  {name}: スキップ（コマンド未設定）")
        log_file.write(f"\n{'='*60}\n")
        log_file.write(f"{name}: SKIPPED\n")
        log_file.write(f"{'='*60}\n\n")
        return "skipped"
    
    print(f"🔄 {name}: 実行中...")
    log_file.write(f"\n{'='*60}\n")
    log_file.write(f"{name}: {command}\n")
    log_file.write(f"{'='*60}\n\n")
    
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=300  # 5分タイムアウト
        )
        
        # 標準出力・エラー出力をログに記録
        if result.stdout:
            log_file.write("STDOUT:\n")
            log_file.write(result.stdout)
            log_file.write("\n")
        
        if result.stderr:
            log_file.write("STDERR:\n")
            log_file.write(result.stderr)
            log_file.write("\n")
        
        if result.returncode == 0:
            print(f"✅ {name}: 成功")
            return "passed"
        else:
            print(f"❌ {name}: 失敗 (exit code: {result.returncode})", file=sys.stderr)
            if result.stderr:
                print(f"   エラー: {result.stderr[:200]}", file=sys.stderr)
            return "failed"
    
    except subprocess.TimeoutExpired:
        print(f"⏱️  {name}: タイムアウト", file=sys.stderr)
        log_file.write("\nERROR: Command timeout (5min)\n")
        return "failed"
    
    except Exception as e:
        print(f"❌ {name}: 例外発生 - {e}", file=sys.stderr)
        log_file.write(f"\nEXCEPTION: {e}\n")
        return "failed"


def main():
    """メイン処理"""
    print("\n" + "="*60)
    print("🚀 ローカル CI 実行")
    print("="*60 + "\n")
    
    # 設定読み込み
    config = load_project_config()
    if config is None:
        print("❌ 設定ファイルの読み込みに失敗しました", file=sys.stderr)
        return 1
    
    ci_config = config.get("ci", {})
    
    # ログディレクトリ作成
    log_dir = ensure_log_dir()
    log_path = log_dir / "latest.log"
    
    # ログファイル開始
    with open(log_path, "w", encoding="utf-8") as log_file:
        log_file.write(f"CI Execution Log\n")
        log_file.write(f"Started at: {datetime.now().isoformat()}\n")
        log_file.write(f"Project: {config.get('name', 'unknown')}\n")
        
        # CI タスク実行
        results = {}
        results["build"] = run_command("Build", ci_config.get("build", ""), log_file)
        results["test"] = run_command("Test", ci_config.get("test", ""), log_file)
        results["format"] = run_command("Format", ci_config.get("format", ""), log_file)
        
        log_file.write(f"\n{'='*60}\n")
        log_file.write(f"Completed at: {datetime.now().isoformat()}\n")
        log_file.write(f"{'='*60}\n")
    
    # 結果サマリー
    print("\n" + "="*60)
    print("📊 CI 結果サマリー")
    print("="*60)
    for task, result in results.items():
        icon = "✅" if result == "passed" else "⏭️" if result == "skipped" else "❌"
        print(f"{icon} {task.capitalize()}: {result}")
    print(f"\n📄 詳細ログ: {log_path}")
    print("="*60 + "\n")
    
    # 失敗があれば非0で終了
    if "failed" in results.values():
        print("❌ CI が失敗しました", file=sys.stderr)
        return 1
    
    print("✅ CI が成功しました")
    return 0


if __name__ == "__main__":
    sys.exit(main())

