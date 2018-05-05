import { IJestStareConfig } from "../processor/doc/IJestStareConfig";
import { Logger } from "../utils/Logger";

/**
 * Service for reading environmental variables
 * @export
 * @class EnvironmentalVariables
 */
export class EnvironmentalVariables {

    /**
     * Prefix for all jest-stare related environmental variables
     * @static
     * @type {string}
     * @memberof EnvironmentalVariables
     */
    public static readonly ENV_PREFIX: string = "JEST_STARE_";

    /**
     * Read all jest-stare related environmental variables
     * @returns {IJestStareConfig} - jest stare config from env vars
     * @memberof EnvironmentalVariables
     */
    public read(): IJestStareConfig {
        const additionalResultsProcessorsValue = this.readEnvValue("ADDITIONAL_RESULTS_PROCESSORS");
        let additionalResultsProcessors: string[];
        if (additionalResultsProcessorsValue != null) {
            try {
                additionalResultsProcessors = JSON.parse(additionalResultsProcessorsValue);
            } catch (e) {
                Logger.get.error("Could not parse additional results processors value." +
                    "It should be a JSON string of an array of strings, like the following: " +
                    JSON.stringify(["jest-html-reporter"]) + "\n You specified: " + additionalResultsProcessorsValue);
            }
        }
        return {
            resultDir: this.readEnvValue("RESULT_DIR"),
            resultJson: this.readEnvValue("RESULT_JSON"),
            resultHtml: this.readEnvValue("RESULT_HTML"),
            jsonOnly: this.readBoolEnvValue("JSON_ONLY"),
            jestStareResults: this.readBoolEnvValue("RESULTS"),
            log: this.readBoolEnvValue("LOG"),
            jestStareConfigJson: this.readEnvValue("CONFIG_JSON"),
            coverageLink: this.readEnvValue("COVERAGE_LINK"),
            additionalResultsProcessors
        };
    }

    /**
     * Combine jest stare config from package json and environmental variables,
     * with environmental variables taking precedence
     * @param packageJsonConfig
     * @param {IJestStareConfig} packageJsonConfig - package json config
     * @param {IJestStareConfig} envConfig - env based config
     * @returns {IJestStareConfig} - merged config
     * @memberof EnvironmentalVariables
     */
    public resolve(packageJsonConfig: IJestStareConfig, envConfig: IJestStareConfig): IJestStareConfig {
        const mergedConfig: IJestStareConfig = {};

        if (envConfig.resultDir != null || packageJsonConfig.resultDir != null) {
            mergedConfig.resultDir = envConfig.resultDir == null ? packageJsonConfig.resultDir : envConfig.resultDir;
        }

        if (envConfig.resultJson != null || packageJsonConfig.resultJson != null) {
            mergedConfig.resultJson = envConfig.resultJson == null ? packageJsonConfig.resultJson : envConfig.resultJson;
        }

        if (envConfig.resultHtml != null || packageJsonConfig.resultHtml != null) {
            mergedConfig.resultHtml = envConfig.resultHtml == null ? packageJsonConfig.resultHtml : envConfig.resultHtml;
        }

        if (envConfig.jsonOnly != null || packageJsonConfig.jsonOnly != null) {
            mergedConfig.jsonOnly = envConfig.jsonOnly == null ? packageJsonConfig.jsonOnly : envConfig.jsonOnly;
        }

        if (envConfig.jestStareConfigJson != null || packageJsonConfig.jestStareConfigJson != null) {
            mergedConfig.jestStareConfigJson =
                envConfig.jestStareConfigJson == null ? packageJsonConfig.jestStareConfigJson : envConfig.jestStareConfigJson;
        }

        if (envConfig.log != null || packageJsonConfig.log != null) {
            mergedConfig.log = envConfig.log == null ? packageJsonConfig.log : envConfig.log;
        }

        if (envConfig.jestStareConfigJson != null || packageJsonConfig.jestStareConfigJson != null) {
            mergedConfig.jestStareConfigJson =
                envConfig.jestStareConfigJson == null ? packageJsonConfig.jestStareConfigJson : envConfig.jestStareConfigJson;
        }

        if (envConfig.coverageLink != null || packageJsonConfig.coverageLink != null) {
            mergedConfig.coverageLink = envConfig.coverageLink == null ? packageJsonConfig.coverageLink : envConfig.coverageLink;
        }

        if (envConfig.additionalResultsProcessors != null || packageJsonConfig.additionalResultsProcessors != null) {
            mergedConfig.additionalResultsProcessors =
                envConfig.additionalResultsProcessors == null ? packageJsonConfig.additionalResultsProcessors : envConfig.additionalResultsProcessors;
        }

        return mergedConfig;
    }


    /**
     * Read a jest-stare environmental variable's value
     * @private
     * @param {string} suffix - the suffix of the environmental variable to read e.g. JSON_ONLY
     * @returns {string} - env value
     * @memberof EnvironmentalVariables
     */
    private readEnvValue(suffix: string): string {
        return process.env[EnvironmentalVariables.ENV_PREFIX + suffix];
    }

    /**
     * Determine whether a boolean-type environmental variable was set
     * @private
     * @param {string} envVariableSuffix suffix of the boolean type environmental variable to check
     * @returns {boolean} - whether or not set
     * @memberof EnvironmentalVariables
     */
    private readBoolEnvValue(suffix: string): boolean {
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
