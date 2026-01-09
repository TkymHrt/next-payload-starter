import { $ } from "bun";

async function main() {
  console.log("Dockerコンテナを起動しています...");
  await $`docker compose up -d`;

  console.log("Next.js 開発サーバーを起動しています...");

  try {
    await $`bun run dev`;
  } catch (err) {
    console.error("開発サーバーが停止しました:", err);
  } finally {
    console.log("\nコンテナを停止しています...");
    await $`docker compose stop`;
  }
}

main();
