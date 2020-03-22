import { debugCli } from "./debugCli";

export function cliExit(text: string, code = 0): void {
  debugCli(text);
  process.exit(code);
}
