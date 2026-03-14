import { program } from "commander";
import { registerAuthCommand } from "./commands/auth.js";
import { registerGenerateCommand } from "./commands/generate.js";
import { registerStatusCommand } from "./commands/status.js";
import { registerCreditsCommand } from "./commands/credits.js";
import { registerExtendCommand } from "./commands/extend.js";
import { registerUpscaleCommand } from "./commands/upscale.js";

program
  .name("kie")
  .description("Generate images and videos with Kie.AI")
  .version("0.1.0");

registerAuthCommand(program);
registerGenerateCommand(program);
registerStatusCommand(program);
registerCreditsCommand(program);
registerExtendCommand(program);
registerUpscaleCommand(program);

program.parse();
