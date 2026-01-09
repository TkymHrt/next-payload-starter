import { $ } from "bun";

const command = process.argv[2];

const composeArgsRaw =
  process.env.PROD_COMPOSE_ARGS ||
  "--env-file .env.production -f compose.prod.yaml";
const composeArgs = composeArgsRaw.split(" ").filter(Boolean);

async function main() {
  try {
    switch (command) {
      case "up":
        await $`docker compose ${composeArgs} up -d --build`;
        break;
      case "down":
        await $`docker compose ${composeArgs} down`;
        break;
      case "reset":
        console.log("警告: 本番用データベースをリセットします...");
        await $`docker compose ${composeArgs} down -v`;
        await $`docker compose ${composeArgs} up -d --build`;
        console.log("本番環境のリセットが完了しました。");
        break;
      default:
        console.error("Usage: bun scripts/prod.ts [up|down|reset]");
        process.exit(1);
    }
  } catch (error) {
    console.error("Command failed", error);
    process.exit(1);
  }
}

main();
