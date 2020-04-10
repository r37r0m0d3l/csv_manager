import { argv } from "yargs";
import { of } from "@r37r0m0d3l/of";
import notifier from "node-notifier";

import { cliExit } from "../helpers/cliExit";
import { csv2db } from "../core/csv2db";

(async (): Promise<void> => {
  const filePath = `${argv.uri}`;
  const [result, error] = await of(csv2db(filePath));
  if (error) {
    cliExit(error.message);
  }
  notifier.notify(
    {
      message: `Inserting accounts into database.
Successful: ${result.successful}.
Failed: ${result.failed}.`,
      sound: true,
      title: "CSV Manager",
      wait: false,
    },
    () => {
      cliExit(`Successful: ${result.successful}. Failed: ${result.failed}.`);
    },
  );
})();
