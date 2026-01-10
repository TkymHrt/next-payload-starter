import { existsSync } from "node:fs";
import { createInterface } from "node:readline";
import { $ } from "bun";

const icons = {
  success: "[OK]",
  error: "[NG]",
  warning: "[!]",
  info: "[i]",
};

const LAYOUT = {
  labelWidth: 24,
  indent: "  ",
};

function getVisualWidth(str: string): number {
  let width = 0;
  for (const char of str) {
    const code = char.codePointAt(0) ?? 0;
    if (
      (code >= 0x30_00 && code <= 0x9f_ff) ||
      (code >= 0xff_00 && code <= 0xff_ef)
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}

function getPadding(label: string): string {
  const visualWidth = getVisualWidth(label);
  const padding = Math.max(0, LAYOUT.labelWidth - visualWidth);
  return " ".repeat(padding);
}

export function printProgress(message: string) {
  console.log(`\n${LAYOUT.indent}> ${message}`);
}

export function printHeader(title: string, subtitle?: string) {
  console.log("");
  console.log(`${LAYOUT.indent}${title}`);
  if (subtitle) {
    console.log(`${LAYOUT.indent}${subtitle}`);
  }
  console.log("");
}

export function printItem(label: string, value: string, icon = icons.success) {
  const spacer = getPadding(label);
  console.log(`${LAYOUT.indent}${icon}  ${label}${spacer} ${value}`);
}

export function printError(label: string, message: string) {
  const spacer = getPadding(label);
  console.error(`${LAYOUT.indent}${icons.error}  ${label}${spacer} ${message}`);
}

export function printWarning(message: string) {
  console.log(`${LAYOUT.indent}${icons.warning}  ${message}`);
}

export function printInfo(message: string) {
  console.log(`${LAYOUT.indent}${icons.info}  ${message}`);
}

export function printHint(message: string) {
  console.log(`${LAYOUT.indent}     ${message}`);
}

export function printStep(current: number, total: number, message: string) {
  console.log(`\n${LAYOUT.indent}[${current}/${total}] ${message}`);
}

export function printSuccessBanner(message: string) {
  console.log(`\n${LAYOUT.indent}${icons.success} ${message}\n`);
}

export async function checkDocker() {
  try {
    await $`docker info`.quiet();
    return true;
  } catch {
    return false;
  }
}

export async function checkCompose() {
  try {
    await $`docker compose version`.quiet();
    return true;
  } catch {
    return false;
  }
}

export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

export function promptConfirmation(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      printWarning(`警告: ${message}`);
      printWarning(
        "非対話環境のため確認できません。安全のためキャンセルします"
      );
      resolve(false);
      return;
    }

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    printWarning(`警告: ${message}`);
    rl.question(
      `${LAYOUT.indent}続行するには 'y' と入力してください: `,
      (answer: string) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === "y");
      }
    );
  });
}
