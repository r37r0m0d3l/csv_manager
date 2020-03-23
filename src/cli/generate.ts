import * as fs from "fs";

import * as faker from "faker";
import * as fsExtra from "fs-extra";
import { argv } from "yargs";
import { ofError } from "@r37r0m0d3l/of";

import { ANSI_CLEAR } from "../helpers/ansiClear";
import { cliExit } from "../helpers/cliExit";
import { cliWrite } from "../helpers/cliWrite";

function generateUser(): object {
  const age = faker.random.number({ min: 18, max: 80 });
  return faker.fake(`{{internet.userName}},{{name.firstName}},{{name.lastName}},${age}`);
}

(async (): Promise<void> => {
  const { count } = argv;
  const generateCount = Number.parseInt(`${count || 10}`);
  const dir = "./temp/";
  const file = `${dir}/accounts.csv`;
  const dirNotAccessible = await ofError(fsExtra.ensureDir(dir));
  if (dirNotAccessible) {
    cliExit(dirNotAccessible.message);
  }
  const dirNotWritable = await ofError(fs.promises.access(dir, fs.constants.W_OK));
  if (dirNotWritable) {
    cliExit(dirNotWritable.message);
  }
  const fileNotAccessible = await ofError(fsExtra.ensureFile(file));
  if (fileNotAccessible) {
    cliExit(fileNotAccessible.message);
  }
  const fileNotWritable = await ofError(fs.promises.access(file, fs.constants.W_OK));
  if (fileNotWritable) {
    cliExit(fileNotWritable.message);
  }
  const fileNotTruncated = await ofError(fs.promises.truncate(file, 0));
  if (fileNotTruncated) {
    cliExit(fileNotTruncated.message);
  }
  const appender = fs.createWriteStream(file, { flags: "a" });
  appender.on("error", (streamError) => {
    cliWrite(ANSI_CLEAR);
    cliExit(streamError.message);
  });
  appender.on("finish", () => {
    cliWrite(ANSI_CLEAR);
    cliExit("Completed!");
  });
  for (let index = 0; index < generateCount; index += 1) {
    cliWrite(`${ANSI_CLEAR}Writing: ${index}\n`);
    appender.write(`${generateUser()}\n`);
  }
  appender.end();
})();
