import { $ } from "bun";
import {
  printError,
  printHeader,
  printProgress,
  printSuccessBanner,
} from "./utils";

async function main() {
  printHeader(
    "開発サーバー起動",
    "DockerコンテナとNext.jsサーバーを立ち上げます"
  );

  let exitCodeToPropagate: number | undefined;

  printProgress("コンテナ起動中...");
  await $`docker compose up -d`;

  printProgress("Next.js サーバー起動中...");

  try {
    await $`bun run dev`;
  } catch (err: unknown) {
    const exitCode = (err as { exitCode?: number })?.exitCode;
    const isNormalExit =
      exitCode === 0 ||
      exitCode === 130 ||
      exitCode === 143 ||
      exitCode === undefined;
    if (!isNormalExit) {
      printError("Dev Server", "サーバーが予期せず停止しました");
      console.error(err);
      exitCodeToPropagate = exitCode ?? 1;
    }
  } finally {
    printProgress("コンテナ停止中...");
    try {
      await $`docker compose stop`;
    } catch (error) {
      printError("Docker Compose", "コンテナ停止に失敗しました");
      console.error(error);
      if (exitCodeToPropagate === undefined) {
        exitCodeToPropagate = 1;
      }
    }

    if (exitCodeToPropagate === undefined) {
      printSuccessBanner("開発環境を停止しました");
    }
  }

  if (exitCodeToPropagate !== undefined) {
    process.exitCode = exitCodeToPropagate;
  }
}

main().catch((error) => {
  printError("予期せぬエラー", String(error));
  process.exit(1);
});
