import { isNullOrUndefined } from "util";
import { IJestStareConfig } from "../processor/doc/IJestStareConfig";
import { Logger } from "../utils/Logger";
import { Constants } from "../processor/Constants";
import { IO } from "../utils/IO";
import { Processor } from "../processor/Processor";

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
    public static run(args: string[]) {

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
        Processor.run(JSON.parse(results), config);
    }
}
