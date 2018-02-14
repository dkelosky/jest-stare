/**
 * Interface mapping fields the user can specify in package.json
 */
export interface IJestStareConfig {
    /**
     * The directory you would like the results to go to
     */
    "resultDir"?: string;
}

/**
 * Key in package.json that specified jest-stare config
 */
export const PACKAGE_JSON_KEY = "jest-stare";
