import { $ } from "bun";

console.log("開発用データベースを再構築しています...");
await $`docker compose down -v`;
await $`docker compose up -d postgres`;
console.log("データベースのリセットが完了しました。");
