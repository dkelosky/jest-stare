import { IJestStareConfig } from "../processor/doc/IJestStareConfig";
import { Logger } from "../utils/Logger";

/**
 * Service for reading environmental variables
 * @export
 * @class EnvVarService
 */
export class EnvVarService {

    /**
     * Creates an instance of EnvVarService.
     * @param {string} mPrefix - prefix of this env var
     * @memberof EnvVarService
     */
    constructor(private mPrefix: string) {}

    /**
     * Read a jest-stare environmental variable's value
     * @private
     * @param {string} suffix - the suffix of the environmental variable to read e.g. JSON_ONLY
     * @returns {string} - env value
     * @memberof EnvVarService
     */
    public readEnvValue(suffix: string): string {
        return process.env[this.mPrefix + suffix];
    }

    /**
     * Determine whether a boolean-type environmental variable was set
     * @private
     * @param {string} envVariableSuffix suffix of the boolean type environmental variable to check
     * @returns {boolean} - whether or not set
     * @memberof EnvVarService
     */
    public readBoolEnvValue(suffix: string): boolean {
        const value = this.readEnvValue(suffix);
        if (value == null) {
            return undefined;
        }
        if ((value).toUpperCase() === "TRUE" || (value === "1")) {
            return true;
        } else if ((value).toUpperCase() === "FALSE" || (value === "0")) {
            return false;
        } else {
            return undefined;
        }
    }
}
