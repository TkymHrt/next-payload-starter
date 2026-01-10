import { existsSync } from "node:fs";
import {
  checkCompose,
  checkDocker,
  printError,
  printHeader,
  printHint,
  printItem,
  printSuccessBanner,
  printWarning,
} from "./utils";

async function main() {
  printHeader("環境チェック", "必要なツールと設定の確認を行います");

  if (!existsSync(".env")) {
    printError(".env ファイル", "見つかりません");
    printHint(".env.example をコピーして .env を作成してください");
    process.exit(1);
  }
  printItem(".env ファイル", "設定ファイルあり");

  if (await checkDocker()) {
    printItem("Docker", "起動中");
  } else {
    printError("Docker", "起動していないか、インストールされていません");
    printWarning("Docker Desktop を起動してください");
    process.exit(1);
  }

  if (await checkCompose()) {
    printItem("Docker Compose", "利用可能");
  } else {
    printError("Docker Compose", "利用できません");
    process.exit(1);
  }

  printSuccessBanner("すべての検証に合格しました");
}

main().catch((error) => {
  printError("予期せぬエラー", String(error));
  process.exit(1);
});
