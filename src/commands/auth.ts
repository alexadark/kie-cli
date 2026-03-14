import { createInterface } from "node:readline";
import type { Command } from "commander";
import chalk from "chalk";
import { setApiKey, getStoredApiKey, getConfigPath } from "../store.js";

const promptHidden = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Mute output to hide the key as it's typed
    process.stdout.write(question);
    const stdin = process.stdin;
    const wasRaw = stdin.isRaw;
    if (stdin.isTTY) stdin.setRawMode(true);

    let input = "";
    const onData = (ch: Buffer) => {
      const char = ch.toString();
      if (char === "\n" || char === "\r") {
        if (stdin.isTTY) stdin.setRawMode(wasRaw ?? false);
        stdin.removeListener("data", onData);
        rl.close();
        process.stdout.write("\n");
        resolve(input);
      } else if (char === "\u007F" || char === "\b") {
        // Backspace
        if (input.length > 0) input = input.slice(0, -1);
      } else if (char === "\u0003") {
        // Ctrl+C
        process.exit(0);
      } else {
        input += char;
        process.stdout.write("*");
      }
    };

    stdin.on("data", onData);
  });
};

export const registerAuthCommand = (program: Command): void => {
  program
    .command("auth")
    .description("Set or view your Kie.AI API key")
    .option("-s, --show", "Show current API key status")
    .action(async (opts: Record<string, unknown>) => {
      if (opts.show) {
        const envKey = process.env.KIE_API_KEY;
        const storedKey = getStoredApiKey();

        if (envKey) {
          console.log(`Source:  ${chalk.cyan("KIE_API_KEY env var")}`);
          console.log(`Key:    ...${envKey.slice(-8)}`);
        } else if (storedKey) {
          console.log(`Source:  ${chalk.cyan(getConfigPath())}`);
          console.log(`Key:    ...${storedKey.slice(-8)}`);
        } else {
          console.log(chalk.yellow("No API key configured."));
        }
        return;
      }

      const key = await promptHidden("Enter your Kie.AI API key: ");

      if (!key.trim()) {
        console.error(chalk.red("No key provided."));
        process.exit(1);
      }

      setApiKey(key.trim());
      console.log(chalk.green("API key saved to"), getConfigPath());
    });
};
