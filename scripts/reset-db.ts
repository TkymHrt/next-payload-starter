import { $ } from "bun";

async function main() {
  try {
    console.log("開発用データベースを再構築しています...");
    await $`docker compose down -v`;
    await $`docker compose up -d postgres`;
    console.log("データベースのリセットが完了しました。");
  } catch (error) {
    console.error("データベースのリセットに失敗しました:", error);
    process.exit(1);
  }
}

main();
