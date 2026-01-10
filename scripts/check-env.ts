import { existsSync } from "node:fs";
import dotenv from "dotenv";
import {
  checkCompose,
  checkDocker,
  printError,
  printHeader,
  printHint,
  printInfo,
  printItem,
  printSuccessBanner,
  printWarning,
} from "./utils";

function requireEnvVar(name: string): boolean {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

async function main() {
  printHeader("環境チェック", "必要なツールと設定の確認を行います");

  if (!existsSync(".env")) {
    printError(".env ファイル", "見つかりません");
    printHint(".env.example をコピーして .env を作成してください");
    process.exit(1);
  }
  printItem(".env ファイル", "設定ファイルあり");

  const dotenvResult = dotenv.config({ path: ".env" });
  if (dotenvResult.error) {
    printError(".env 読み込み", "dotenv での読み込みに失敗しました");
    console.error(dotenvResult.error);
    process.exit(1);
  }

  const requiredVars = ["PAYLOAD_SECRET", "DATABASE_URI"] as const;
  let missingCount = 0;
  for (const name of requiredVars) {
    if (requireEnvVar(name)) {
      printItem(name, "設定あり");
    } else {
      missingCount += 1;
      printError(name, "未設定です");
    }
  }
  if (missingCount > 0) {
    printHint("Payload 起動に必要な環境変数が不足しています");
    process.exit(1);
  }

  const s3Vars = [
    "S3_BUCKET",
    "S3_ACCESS_KEY_ID",
    "S3_SECRET_ACCESS_KEY",
    "S3_REGION",
  ] as const;
  const configuredS3Count = s3Vars.filter((name) => requireEnvVar(name)).length;
  if (configuredS3Count > 0 && configuredS3Count < s3Vars.length) {
    printWarning(
      "S3 設定が一部だけ入っています（起動やアップロードで失敗する可能性があります）"
    );
    printInfo(
      `不足している可能性: ${s3Vars.filter((n) => !requireEnvVar(n)).join(", ")}`
    );
  }

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
