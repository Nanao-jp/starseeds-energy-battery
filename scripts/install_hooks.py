#!/usr/bin/env python3
"""
Git hooks インストールスクリプト

.githooks/pre-push を .git/hooks/pre-push にコピーします。
既に存在する場合は安全確認のうえ上書き or スキップします。
"""

import os
import shutil
import sys
from pathlib import Path


def find_git_root():
    """Gitルートディレクトリを探す"""
    current = Path(__file__).parent.parent.resolve()
    
    while current != current.parent:
        if (current / ".git").exists():
            return current
        current = current.parent
    
    return None


def install_hook(source_hook, target_hook):
    """フックファイルをインストール"""
    if not source_hook.exists():
        print(f"❌ ソースフックが見つかりません: {source_hook}", file=sys.stderr)
        return False
    
    # ターゲットディレクトリを作成
    target_hook.parent.mkdir(parents=True, exist_ok=True)
    
    # 既存ファイルのチェック
    if target_hook.exists():
        print(f"⚠️  既存のフックが見つかりました: {target_hook}")
        
        # 内容を比較
        with open(source_hook, "r", encoding="utf-8") as f:
            source_content = f.read()
        
        with open(target_hook, "r", encoding="utf-8") as f:
            target_content = f.read()
        
        if source_content == target_content:
            print("✅ フックは既にインストール済みです（同一内容）")
            return True
        
        # 異なる内容の場合は上書き確認
        print("📝 既存のフックと内容が異なります")
        response = input("上書きしますか？ [y/N]: ").strip().lower()
        
        if response not in ["y", "yes"]:
            print("⏭️  フックのインストールをスキップしました")
            return False
    
    # フックをコピー
    try:
        shutil.copy2(source_hook, target_hook)
        
        # 実行権限を付与（Unix系）
        if os.name != "nt":  # Windows以外
            target_hook.chmod(0o755)
        
        print(f"✅ フックをインストールしました: {target_hook}")
        return True
    
    except Exception as e:
        print(f"❌ フックのインストールに失敗: {e}", file=sys.stderr)
        return False


def main():
    """メイン処理"""
    print("\n" + "="*60)
    print("🔧 Git Hooks インストール")
    print("="*60 + "\n")
    
    # Gitルートを探す
    git_root = find_git_root()
    
    if git_root is None:
        print("❌ Gitリポジトリが見つかりません", file=sys.stderr)
        print("   このスクリプトはGitリポジトリ内で実行してください", file=sys.stderr)
        return 1
    
    print(f"📂 Gitリポジトリ: {git_root}")
    
    # pre-push フックをインストール
    source_hook = git_root / ".githooks" / "pre-push"
    target_hook = git_root / ".git" / "hooks" / "pre-push"
    
    success = install_hook(source_hook, target_hook)
    
    print("\n" + "="*60)
    if success:
        print("✅ インストール完了")
        print("\n📝 次のステップ:")
        print("   1. コードを変更してコミット")
        print("   2. git push すると自動でローカルCIが実行されます")
    else:
        print("⚠️  インストールが完了しませんでした")
    print("="*60 + "\n")
    
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())

