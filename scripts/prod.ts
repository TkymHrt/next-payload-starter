import { $ } from "bun";
import {
  printError,
  printHeader,
  printInfo,
  printSuccessBanner,
  promptConfirmation,
} from "./utils";

const command = process.argv[2];

const envFile = process.env.PROD_ENV_FILE || ".env.production";
const composeFile = process.env.PROD_COMPOSE_FILE || "compose.prod.yaml";

const commands = {
  up: async () => {
    printHeader("本番環境起動", "ビルドと起動を実行します");
    await $`docker compose --env-file ${envFile} -f ${composeFile} up -d --build`;
    printSuccessBanner("本番環境を起動しました");
  },
  down: async () => {
    printHeader("本番環境停止", "コンテナを停止します");
    await $`docker compose --env-file ${envFile} -f ${composeFile} down`;
    printSuccessBanner("本番環境を停止しました");
  },
  reset: async () => {
    printHeader("本番DBリセット", "危険な操作です");
    const confirmed = await promptConfirmation(
      "本番用データベースを削除します。すべてのデータが失われます！"
    );
    if (!confirmed) {
      printInfo("操作がキャンセルされました");
      return;
    }

    await $`docker compose --env-file ${envFile} -f ${composeFile} down -v`;
    printSuccessBanner("本番環境を削除しました");
  },
};

async function main() {
  const action = command as keyof typeof commands;

  if (action in commands) {
    try {
      await commands[action]();
    } catch (error) {
      printError("実行エラー", "コマンドの実行中にエラーが発生しました");
      console.error(error);
      process.exit(1);
    }
  } else {
    printError("不明なコマンド", command || "コマンド指定なし");
    console.error(`使用可能なコマンド: ${Object.keys(commands).join(", ")}`);
    process.exit(1);
  }
}

main().catch((error) => {
  printError("予期せぬエラー", String(error));
  process.exit(1);
});
