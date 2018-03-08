import { IResultsProcessorInput } from "./doc/jest/IResultsProcessorInput";
import { Logger } from "../utils/Logger";
import { Constants } from "./Constants";


export class AdditionalProcessors {

    /**
     * Pass the result processor input given to jest-stare to additional
     * test results processors
     * @param jestTestData - input passed to jest-stare
     * @param processors - list of test results processors (e.g. ["jest-html-reporter"])
     *                     to forward the data to
     */
    public static execute(jestTestData: IResultsProcessorInput, processors: string[]): void {
        const chalk = require("chalk");
        for (const processor of processors) {
            try {
                require(processor)(jestTestData);
                AdditionalProcessors.logger.debug(Constants.LOGO + " passed results to additional processor \"" +
                    processor + "\"" + chalk.default.green("\t**"));
            } catch (e) {
                AdditionalProcessors.logger.error("Error executing additional processor: \"" + processor + "\"" + e);
            }
        }
    }

    private static logger = new Logger();
}
