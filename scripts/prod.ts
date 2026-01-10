import { $ } from "bun";
import {
  checkCompose,
  checkDocker,
  fileExists,
  printError,
  printHeader,
  printInfo,
  printSuccessBanner,
  promptConfirmation,
} from "./utils";

const command = process.argv[2];

const envFile = process.env.PROD_ENV_FILE || ".env.production";
const composeFile = process.env.PROD_COMPOSE_FILE || "compose.prod.yaml";

function preflight(): void {
  if (!fileExists(envFile)) {
    printError("env-file", `${envFile} が見つかりません`);
    printInfo("必要に応じて PROD_ENV_FILE を設定してください");
    process.exit(1);
  }

  if (!fileExists(composeFile)) {
    printError("compose-file", `${composeFile} が見つかりません`);
    printInfo("必要に応じて PROD_COMPOSE_FILE を設定してください");
    process.exit(1);
  }
}

const commands = {
  up: async () => {
    printHeader("本番環境起動", "ビルドと起動を実行します");
    preflight();
    await $`docker compose --env-file ${envFile} -f ${composeFile} up -d --build`;
    printSuccessBanner("本番環境を起動しました");
  },
  down: async () => {
    printHeader("本番環境停止", "コンテナを停止します");
    preflight();
    await $`docker compose --env-file ${envFile} -f ${composeFile} down`;
    printSuccessBanner("本番環境を停止しました");
  },
  reset: async () => {
    printHeader("本番DBリセット", "危険な操作です");
    preflight();
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

  if (!(await checkDocker())) {
    printError("Docker", "起動していないか、インストールされていません");
    process.exit(1);
  }

  if (!(await checkCompose())) {
    printError("Docker Compose", "利用できません");
    process.exit(1);
  }

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
