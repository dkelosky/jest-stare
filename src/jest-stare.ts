#!/usr/bin/env node
import { Logger } from "./utils/Logger";
import { isNullOrUndefined } from "util";
import { Constants } from "./processor/Constants";
import { IO } from "./utils/IO";
import { Processor } from "./processor/Processor";
import { IJestStareConfig } from "./processor/doc/IJestStareConfig";

const ignoredParmCount = 2;
const args = process.argv.slice(ignoredParmCount);
let config: IJestStareConfig = {};

if (isNullOrUndefined(args[0])) {
    Logger.get.error(Constants.NO_CLI_INPUT);
    throw new Error();
}

if (!isNullOrUndefined(args[1])) {
    config.resultDir = args[1];
} else {
    config = undefined;
}

const results = IO.readFileSync(args[0]);
Processor.resultsProcessor(JSON.parse(results), config);
