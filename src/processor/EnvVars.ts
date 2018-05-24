import { IJestStareConfig } from "./doc/IJestStareConfig";
import { Logger } from "../utils/Logger";
import { EnvVarService } from "../utils/EnvVarService";

/**
 * Service for reading environmental variables
 * @export
 * @class EnvVars
 */
export class EnvVars {

    /**
     * Prefix for all jest-stare related environmental variables
     * @static
     * @type {string}
     * @memberof EnvVars
     */
    public static readonly ENV_PREFIX: string = "JEST_STARE_";

    /**
     * Creates an instance of EnvVars.
     * @memberof EnvVars
     */
    constructor(private mEnvSrv = new EnvVarService(EnvVars.ENV_PREFIX)) {}

    /**
     * Read all jest-stare related environmental variables
     * @returns {IJestStareConfig} - jest stare config from env vars
     * @memberof EnvVars
     */
    public read(): IJestStareConfig {
        const additionalResultsProcessorsValue = this.mEnvSrv.readEnvValue("ADDITIONAL_RESULTS_PROCESSORS");
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
            resultDir: this.mEnvSrv.readEnvValue("RESULT_DIR"),
            resultJson: this.mEnvSrv.readEnvValue("RESULT_JSON"),
            resultHtml: this.mEnvSrv.readEnvValue("RESULT_HTML"),
            log: this.mEnvSrv.readBoolEnvValue("LOG"),
            merge: this.mEnvSrv.readBoolEnvValue("MERGE"),
            jestStareConfigJson: this.mEnvSrv.readEnvValue("CONFIG_JSON"),
            coverageLink: this.mEnvSrv.readEnvValue("COVERAGE_LINK"),
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
     * @memberof EnvVars
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

        if (envConfig.log != null || packageJsonConfig.log != null) {
            mergedConfig.log = envConfig.log == null ? packageJsonConfig.log : envConfig.log;
        }

        if (envConfig.merge != null || packageJsonConfig.merge != null) {
            mergedConfig.merge = envConfig.merge == null ? packageJsonConfig.merge : envConfig.merge;
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
}
