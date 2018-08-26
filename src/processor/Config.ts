import { isNullOrUndefined } from "util";
import { Constants } from "./Constants";
import { IJestStareConfig, PACKAGE_JSON_KEY } from "./doc/IJestStareConfig";
import { EnvVars } from "./EnvVars";
import { Logger } from "../utils/Logger";
import { IProcessParms } from "./doc/IProcessParms";
import { IO } from "../utils/IO";

/**
 * Configuration for processor
 * @export
 * @class Config
 */
export class Config {

    /**
     * Creates an instance of Config.
     * @param {IJestStareConfig} mExplicitConfig - explicit configuration
     * @memberof Config
     */
    constructor(private mLogger: Logger, private mExplicitConfig: IJestStareConfig, private mProcessParms: IProcessParms) { }

    /**
     * Build config from explicit config, package.json, and defaults
     * @returns {IJestStareConfig} - constructed config
     * @memberof Config
     */
    public buildConfig(): IJestStareConfig {

        // get configuration
        const packageJsonConfig = this.getJestStareConfig();

        // read environmental variables and merge them with the package.json config (env takes precedence)
        const envVars = new EnvVars();
        const mergedEnvAndPackageJsonConfig = envVars.resolve(packageJsonConfig, envVars.read());

        // explicit config takes precedence over  env and package.json
        const config = this.mExplicitConfig || mergedEnvAndPackageJsonConfig;

        // take packagejson options after setting explicit config (concatenate both)
        if (this.mExplicitConfig != null) {
            Object.keys(mergedEnvAndPackageJsonConfig).forEach((key) => {
                if (isNullOrUndefined(this.mExplicitConfig[key]) && !isNullOrUndefined(mergedEnvAndPackageJsonConfig[key])) {
                    config[key] = mergedEnvAndPackageJsonConfig[key];
                }
            });
        }

        if (config.resultDir == null) {
            config.resultDir = Constants.DEFAULT_RESULTS_DIR + "/";
        } else {
            config.resultDir = config.resultDir + "/"; // append an extra slash in case the user didn't add one
        }

        // suppress logging if requested
        // NOTE(Kelosky): must be first, to suppress all logging
        if (!isNullOrUndefined(config.log)) {
            this.mLogger.on = config.log;
        }

        // record if we were invoked programmatically
        // NOTE(Kelosky): should be second, to record if override config
        if (!isNullOrUndefined(this.mExplicitConfig)) {

            // display if not internal invocation
            if (this.mProcessParms && this.mProcessParms.reporter) {
                // do nothing
            } else {
                this.mLogger.info(Constants.OVERRIDE_JEST_STARE_CONFIG);
            }
        }

        if (isNullOrUndefined(config.resultHtml)) {
            this.mLogger.debug("Setting to default resultHtml");
            config.resultHtml = Constants.MAIN_HTML;
        } else {
            if (config.resultHtml.indexOf(Constants.HTML_EXTENSION) === -1) {
                // add .html if the user did not specify it
                config.resultHtml = config.resultHtml + Constants.HTML_EXTENSION;
            }
        }

        if (isNullOrUndefined(config.resultJson)) {
            config.resultJson = Constants.RESULTS_RAW;
        }

        return config;
    }


    /**
     * Read from the user's package.json, if present
     * @private
     * @returns {IJestStareConfig} - config object
     * @memberof Config
     */
    private getJestStareConfig(): IJestStareConfig {
        const packageJsonObject = IO.readPackageJson();
        if (packageJsonObject[PACKAGE_JSON_KEY] == null) {
            // package json found, but no jest stare config
            return {};
        } else {
            // found the user's package.json config
            return packageJsonObject[PACKAGE_JSON_KEY];
        }
    }

}
