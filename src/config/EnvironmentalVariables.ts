import { IJestStareConfig } from "../processor/doc/IJestStareConfig";
import { Logger } from "../utils/Logger";

/**
 * Service for reading environmental variables
 */
export class EnvironmentalVariables {

    /**
     * Prefix for all jest-stare related environmental variables
     * @type {string}
     */
    public static readonly ENV_PREFIX: string = "JEST_STARE_";

    /**
     * Read all jest-stare related environmental variables
     */
    public static read(): IJestStareConfig {
        const additionalResultsProcessorsValue = this.readEnvValue("ADDITIONAL_RESULTS_PROCESSORS");
        let additionalResultsProcessors: string[];
        if (additionalResultsProcessorsValue != null) {
            try {
                additionalResultsProcessors = JSON.parse(additionalResultsProcessorsValue);
            } catch (e) {
                Logger.get.error("Could not parse additional results processors value." +
                    "It should be a JSON string of an array of strings, like the following: " +
                    JSON.stringify(["jest-html-reporter"] +"\n You specified: " + additionalResultsProcessorsValue));
            }
        }
        return {
            jsonOnly: this.booleanEnvVariableIsTrue("JSON_ONLY"),
            resultHtml: this.readEnvValue("RESULT_HTML"),
            resultDir: this.readEnvValue("RESULT_DIR"),
            resultJson: this.readEnvValue("RESULT_JSON"),
            log: this.booleanEnvVariableIsTrue("LOG"),
            coverageLink: this.readEnvValue("COVERAGE_LINK"),
            jestStareConfigJson: this.readEnvValue("CONFIG_JSON"),
            additionalResultsProcessors
        };
    }

    /**
     * Combine jest stare config from package json and environmental variables,
     * with environmental variables taking precedence
     * @param packageJsonConfig
     */
    public static resolve(packageJsonConfig: IJestStareConfig, envConfig: IJestStareConfig): IJestStareConfig {

        return {
            jsonOnly:
                envConfig.jsonOnly == null ?
                    packageJsonConfig.jsonOnly : envConfig.jsonOnly,

            resultDir:
                envConfig.resultDir == null ?
                    packageJsonConfig.resultDir : envConfig.resultDir,

            resultJson:
                envConfig.resultJson == null ?
                    packageJsonConfig.resultJson : envConfig.resultJson,

            resultHtml:
                envConfig.resultHtml == null ?
                    packageJsonConfig.resultHtml : envConfig.resultHtml,

            log:
                envConfig.log == null ?
                    packageJsonConfig.log : envConfig.log,

            jestStareConfigJson:
                envConfig.jestStareConfigJson == null ?
                    packageJsonConfig.jestStareConfigJson : envConfig.jestStareConfigJson,

            coverageLink:
                envConfig.coverageLink == null ?
                    packageJsonConfig.coverageLink : envConfig.coverageLink,

            additionalResultsProcessors:
                envConfig.additionalResultsProcessors == null ?
                    packageJsonConfig.additionalResultsProcessors : envConfig.additionalResultsProcessors

        };
    }


    /**
     * Read a jest-stare environmental variable's value
     * @param {string} suffix - the suffix of the environmental variable to read e.g. JSON_ONLY
     */
    private static readEnvValue(suffix: string): string {
        return process.env[EnvironmentalVariables.ENV_PREFIX + suffix];
    }

    /**
     * Determine whether a boolean-type environmental variable was set
     * @param envVariableSuffix suffix of the boolean type environmental variable to check
     */
    private static booleanEnvVariableIsTrue(envVariableSuffix: string): boolean {
        const value = this.readEnvValue(envVariableSuffix);
        if (value == null) {
            return undefined;
        }
        return (value).toUpperCase() === "TRUE" || (value === "1");
    }
}
