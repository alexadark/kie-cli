import type { Command } from "commander";
import chalk from "chalk";
import { request } from "../client.js";
import type { CreditData } from "../types.js";

export const registerCreditsCommand = (program: Command): void => {
  program
    .command("credits")
    .description("Check credit balance")
    .action(async () => {
      try {
        const data = await request<CreditData>("GET", "/chat/credit");
        console.log(
          `Credits: ${chalk.green(data.remainingCredits)} / ${data.totalCredits} remaining`,
        );
        console.log(chalk.dim(`Used: ${data.usedCredits}`));
      } catch (err) {
        console.error(chalk.red("Error:"), (err as Error).message);
        process.exit(1);
      }
    });
};
