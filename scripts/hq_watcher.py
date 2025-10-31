#!/usr/bin/env python3
"""
HQ Watcher - prompts/ 監視スクリプト

origin/main を定期 fetch し、prompts/ の新規ファイルを検知します。
.agent/state/last_seen_prompt.json に最後に処理したファイルを保存します。

注意: このスクリプトは基本機能のみ実装しています。
      実際のCursor起動・自動トリガーは拡張ポイントとして残しています。
"""

import argparse
import json
import os
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path


def load_project_config():
    """プロジェクト設定を読み込む"""
    config_path = Path(__file__).parent.parent / ".agent" / "project.json"
    
    if not config_path.exists():
        return {"auto_trigger": False}
    
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {"auto_trigger": False}


def load_state():
    """状態ファイルを読み込む"""
    state_dir = Path(__file__).parent.parent / ".agent" / "state"
    state_dir.mkdir(parents=True, exist_ok=True)
    
    state_path = state_dir / "last_seen_prompt.json"
    
    if not state_path.exists():
        return {"last_prompt": None, "last_check": None}
    
    try:
        with open(state_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {"last_prompt": None, "last_check": None}


def save_state(state):
    """状態ファイルを保存"""
    state_dir = Path(__file__).parent.parent / ".agent" / "state"
    state_dir.mkdir(parents=True, exist_ok=True)
    
    state_path = state_dir / "last_seen_prompt.json"
    
    with open(state_path, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)


def fetch_origin():
    """origin/main を fetch"""
    try:
        subprocess.run(
            ["git", "fetch", "origin", "main"],
            check=True,
            capture_output=True
        )
        return True
    except subprocess.CalledProcessError:
        return False


def get_prompts_files():
    """prompts/ 配下のファイル一覧を取得（_SCHEMA.md を除く）"""
    prompts_dir = Path(__file__).parent.parent / "prompts"
    
    if not prompts_dir.exists():
        return []
    
    files = []
    for file in prompts_dir.glob("*.md"):
        # スキーマファイルは除外
        if file.name.startswith("_"):
            continue
        files.append(file)
    
    # 更新日時でソート（新しい順）
    files.sort(key=lambda f: f.stat().st_mtime, reverse=True)
    
    return files


def check_new_prompts(state):
    """新規プロンプトをチェック"""
    prompts = get_prompts_files()
    
    if not prompts:
        return None
    
    # 最新のプロンプトを取得
    latest_prompt = prompts[0]
    
    # 前回と同じ場合はスキップ
    if state.get("last_prompt") == str(latest_prompt):
        return None
    
    return latest_prompt


def main():
    """メイン処理"""
    parser = argparse.ArgumentParser(
        description="HQ Watcher - prompts/ ディレクトリを監視"
    )
    parser.add_argument(
        "--interval",
        type=int,
        default=60,
        help="チェック間隔（秒）（デフォルト: 60）"
    )
    parser.add_argument(
        "--once",
        action="store_true",
        help="1回だけ実行して終了"
    )
    
    args = parser.parse_args()
    
    print("\n" + "="*60)
    print("👁️  HQ Watcher 起動")
    print("="*60)
    
    # 設定読み込み
    config = load_project_config()
    auto_trigger = config.get("auto_trigger", False)
    
    if not auto_trigger and not args.once:
        print("⚠️  auto_trigger が無効です（.agent/project.json）")
        print("   監視モードは有効化されていません")
        print("   --once オプションで1回だけ実行できます")
        return 1
    
    print(f"📂 監視対象: prompts/")
    print(f"⏱️  間隔: {args.interval}秒")
    print(f"🔄 自動トリガー: {'有効' if auto_trigger else '無効'}")
    print("="*60 + "\n")
    
    state = load_state()
    
    try:
        while True:
            # origin/main を fetch
            if fetch_origin():
                print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ fetch完了")
            else:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] ⚠️  fetch失敗（スキップ）")
            
            # 新規プロンプトをチェック
            new_prompt = check_new_prompts(state)
            
            if new_prompt:
                print(f"\n🆕 新規プロンプト検知: {new_prompt.name}")
                print(f"📄 パス: {new_prompt}")
                
                # 状態を更新
                state["last_prompt"] = str(new_prompt)
                state["last_check"] = datetime.now().isoformat()
                save_state(state)
                
                if auto_trigger:
                    print("\n💡 拡張ポイント: ここでCursorを自動起動する処理を実装")
                    print("   （現在は通知のみ）")
                
                print("")
            
            # 1回だけ実行する場合は終了
            if args.once:
                break
            
            # 待機
            time.sleep(args.interval)
    
    except KeyboardInterrupt:
        print("\n\n⏹️  監視を停止しました")
        return 0


if __name__ == "__main__":
    sys.exit(main())

