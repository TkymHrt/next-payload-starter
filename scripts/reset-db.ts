import { $ } from "bun";
import {
  printError,
  printHeader,
  printInfo,
  printSuccessBanner,
  promptConfirmation,
} from "./utils";

async function main() {
  try {
    printHeader("DBリセット", "開発用データベースを削除します");

    const confirmed = await promptConfirmation(
      "すべてのデータが削除されます！この操作は取り消せません。"
    );
    if (!confirmed) {
      printInfo("操作がキャンセルされました");
      process.exit(0);
    }

    await $`docker compose down -v`;

    printSuccessBanner("データベースを削除しました");
  } catch (error) {
    printError("リセット失敗", "データベースの削除に失敗しました");
    console.error(error);
    process.exit(1);
  }
}

main().catch((error) => {
  printError("予期せぬエラー", String(error));
  process.exit(1);
});
