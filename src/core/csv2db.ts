import * as fs from "fs";

import * as csv2 from "csv2";
import * as through2 from "through2";
import { ofError } from "@r37r0m0d3l/of";

import { ANSI_CLEAR } from "../helpers/ansiClear";
import { cliWrite } from "../helpers/cliWrite";
import { debugCli } from "../helpers/debugCli";
import { modelAccount } from "../models/account";
import { serviceDatabase } from "../services/database";

async function csv2db(filePath: string): Promise<{ failed: number; successful: number }> {
  const cantRead = await ofError(fs.promises.access(filePath, fs.constants.R_OK));
  if (cantRead) {
    throw cantRead;
  }
  const databaseError = await ofError(serviceDatabase.init());
  if (databaseError) {
    throw databaseError;
  }
  return new Promise((resolve) => {
    let successful = 0;
    let failed = 0;
    const onFinal = (eventName: string): void => {
      cliWrite(ANSI_CLEAR);
      debugCli(`Process completed with: ${eventName}`);
      resolve({ successful, failed });
    };
    fs.createReadStream(filePath)
      .pipe(csv2())
      .pipe(
        through2({ objectMode: true }, function (chunk, _enc, callback) {
          const doc = {
            UserName: `${chunk[0]}`.trim(),
            FirstName: `${chunk[1]}`.trim(),
            LastName: `${chunk[2]}`.trim(),
            Age: Number.parseInt(`${chunk[3]}`.trim()),
          };
          modelAccount
            .create(doc)
            .then(() => {
              successful += 1;
            })
            .catch(() => {
              failed += 1;
            })
            .finally(() => {
              cliWrite(`${ANSI_CLEAR}Successful: ${successful}. Failed: ${failed}.`);
              callback();
            });
        }),
      )
      .on("close", () => onFinal("close"))
      .on("end", () => onFinal("end"))
      .on("error", () => onFinal("error"))
      .on("finish", () => onFinal("finish"));
  });
}

export { csv2db };
