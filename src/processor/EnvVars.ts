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
    constructor(private mEnvSrv = new EnvVarService(EnvVars.ENV_PREFIX)) { }

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
            jestStareConfigJson: this.mEnvSrv.readEnvValue("CONFIG_JSON"),
            jestGlobalConfigJson: this.mEnvSrv.readEnvValue("GLOBAL_CONFIG_JSON"),
            coverageLink: this.mEnvSrv.readEnvValue("COVERAGE_LINK"),
            report: this.mEnvSrv.readBoolEnvValue("REPORT"),
            reportTitle: this.mEnvSrv.readEnvValue("REPORT_TITLE"),
            reportHeadline: this.mEnvSrv.readEnvValue("REPORT_HEADLINE"),
            reportSummary: this.mEnvSrv.readBoolEnvValue("REPORT_SUMMARY"),
            additionalResultsProcessors,
            disableCharts: this.mEnvSrv.readBoolEnvValue("DISABLE_CHARTS"),
            hidePassing: this.mEnvSrv.readBoolEnvValue("HIDE_PASSING"),
            hideFailing: this.mEnvSrv.readBoolEnvValue("HIDE_FAILING")
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

        if (envConfig.report != null || packageJsonConfig.report != null) {
            mergedConfig.report = envConfig.report == null ? packageJsonConfig.report : envConfig.report;
        }

        if (envConfig.reportTitle != null || packageJsonConfig.reportTitle != null) {
            mergedConfig.reportTitle = envConfig.reportTitle == null ? packageJsonConfig.reportTitle : envConfig.reportTitle;
        }

        if (envConfig.reportHeadline != null || packageJsonConfig.reportHeadline != null) {
            mergedConfig.reportHeadline = envConfig.reportHeadline == null ? packageJsonConfig.reportHeadline : envConfig.reportHeadline;
        }

        if (envConfig.reportSummary != null || packageJsonConfig.reportSummary != null) {
            mergedConfig.reportSummary = envConfig.reportSummary == null ? packageJsonConfig.reportSummary : envConfig.reportSummary;
        }

        if (envConfig.jestStareConfigJson != null || packageJsonConfig.jestStareConfigJson != null) {
            mergedConfig.jestStareConfigJson =
                envConfig.jestStareConfigJson == null ? packageJsonConfig.jestStareConfigJson : envConfig.jestStareConfigJson;
        }

        if (envConfig.jestGlobalConfigJson != null || packageJsonConfig.jestGlobalConfigJson != null) {
            mergedConfig.jestGlobalConfigJson =
                envConfig.jestGlobalConfigJson == null ? packageJsonConfig.jestGlobalConfigJson : envConfig.jestGlobalConfigJson;
        }

        if (envConfig.coverageLink != null || packageJsonConfig.coverageLink != null) {
            mergedConfig.coverageLink = envConfig.coverageLink == null ? packageJsonConfig.coverageLink : envConfig.coverageLink;
        }

        if (envConfig.additionalResultsProcessors != null || packageJsonConfig.additionalResultsProcessors != null) {
            mergedConfig.additionalResultsProcessors =
                envConfig.additionalResultsProcessors == null ? packageJsonConfig.additionalResultsProcessors : envConfig.additionalResultsProcessors;
        }

        if (envConfig.disableCharts != null || packageJsonConfig.disableCharts != null) {
            mergedConfig.disableCharts =
                envConfig.disableCharts == null ? packageJsonConfig.disableCharts : envConfig.disableCharts;
        }

        if (envConfig.hidePassing != null || packageJsonConfig.hidePassing != null) {
            mergedConfig.hidePassing =
                envConfig.hidePassing == null ? packageJsonConfig.hidePassing : envConfig.hidePassing;
        }

        if (envConfig.hideFailing != null || packageJsonConfig.hideFailing != null) {
            mergedConfig.hideFailing =
                envConfig.hideFailing == null ? packageJsonConfig.hideFailing : envConfig.hideFailing;
        }

        return mergedConfig;
    }
}
