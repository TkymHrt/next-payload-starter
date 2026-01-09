import { existsSync } from "node:fs";
import { $ } from "bun";

async function main() {
  console.log("[検証開始] 開発環境のステータスを確認しています...");

  if (!existsSync(".env")) {
    console.error(
      "エラー: .env ファイルが見つかりません。.env.example をコピーして作成してください。"
    );
    process.exit(1);
  }
  console.log("OK: .env ファイルを確認しました。");

  try {
    await $`docker info`.quiet();
    console.log("OK: Docker の動作を確認しました。");
  } catch {
    console.error(
      "エラー: Dockerが起動していないか、インストールされていません。"
    );
    process.exit(1);
  }

  console.log("検証完了: 開発環境は正常です。");
}

main();
