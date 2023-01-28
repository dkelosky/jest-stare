import { IJestStareConfig } from "../processor/doc/IJestStareConfig";
import { Logger } from "../utils/Logger";
import { Constants } from "../processor/Constants";
import { IO } from "../utils/IO";
import { Processor } from "../processor/Processor";
import * as yargs from "yargs";

/**
 * Handle CLI execution
 * @export
 * @class CLI
 */
export class CLI {
    /**
     * Read args and invoke processor
     * @static
     * @param {string[]} args - array separated arguments
     * @memberof CLI
     */
    public static run(argv: string[]) {
        const args = yargs
            .usage("$0 <testResults> [resultDir]", "jest-stare CLI", (y) =>
                y
                    .positional("testResults", { type: "string" })
                    .positional("resultDir", { type: "string" })
            )
            .options({
                coverageLink: {
                    type: "string",
                    description:
                        "Link to coverage report for convenient referencing in top left of HTML report"
                }
            })
            .strict()
            .parse(argv);

        const config: IJestStareConfig = {};

        if ((args as any).testResults == null) {
            Logger.get.error(Constants.NO_CLI_INPUT);
            throw new Error();
        }

        if ((args as any).resultDir != null) {
            config.resultDir = (args as any).resultDir as string;
        }

        if ((args as any).coverageLink != null) {
            config.coverageLink = (args as any).coverageLink;
        }

        const results = IO.readFileSync((args as any).testResults as string);
        Processor.run(JSON.parse(results), config);
    }
}
