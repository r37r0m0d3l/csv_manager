import { createWriteStream } from "fs";

import * as faker from "faker";

import { argv } from "yargs";
import {
  createDirectory,
  createFile,
  dirIsWritable,
  fileIsWritable,
  fileTruncate,
} from "@hilesystem/local";

import { ANSI_CLEAR } from "../helpers/ansiClear";
import { cliExit } from "../helpers/cliExit";
import { cliWrite } from "../helpers/cliWrite";
import { notify } from "../helpers/notify";

function generateUser(): object {
  const age = faker.random.number({ min: 18, max: 80 });
  return faker.fake(`{{internet.userName}},{{name.firstName}},{{name.lastName}},${age}`);
}

(async (): Promise<void> => {
  const { count } = argv;
  const generateCount = Number.parseInt(`${count || 10}`);
  const dir = "./temp/";
  const file = `${dir}/accounts.csv`;
  const dirNotAccessible = await createDirectory(dir);
  if (dirNotAccessible !== true) {
    cliExit(dirNotAccessible.message);
  }
  const isDirWritable = await dirIsWritable(dir);
  if (isDirWritable !== true) {
    cliExit(isDirWritable.message);
  }
  const fileNotAccessible = await createFile(file);
  if (fileNotAccessible !== true) {
    cliExit(fileNotAccessible.message);
  }
  const isFileWritable = await fileIsWritable(file);
  if (isFileWritable !== true) {
    cliExit(isFileWritable.message);
  }
  const isTruncated = await fileTruncate(file);
  if (isTruncated !== true) {
    cliExit(isTruncated.message);
  }
  const appender = createWriteStream(file, { flags: "a" });
  appender.on("error", (streamError) => {
    cliWrite(ANSI_CLEAR);
    cliExit(streamError.message);
  });
  appender.on("finish", () => {
    notify(
      `Generating ${generateCount} accounts into CSV file completed!`,
      "CSV Manager",
      () => {
        cliWrite(ANSI_CLEAR);
        cliExit("Completed!");
      },
      false,
    );
  });
  for (let index = 0; index < generateCount; index += 1) {
    cliWrite(`${ANSI_CLEAR}Writing: ${index}\n`);
    appender.write(`${generateUser()}\n`);
  }
  appender.end();
})();
