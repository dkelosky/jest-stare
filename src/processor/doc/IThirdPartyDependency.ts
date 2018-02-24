/**
 * Class to describe third party dependencies
 * @export
 * @interface IThirdPartyDependency
 */
export interface IThirdPartyDependency {

    /**
     * Directory in node_modules where third party module resides
     * @type {string}
     * @memberof IThirdPartyDependency
     */
    requireDir: string;

    /**
     * Name of dependency
     * @type {string}
     * @memberof IThirdPartyDependency
     */
    file: string;

    /**
     * Target directory of file
     * @type {string}
     * @memberof IThirdPartyDependency
     */
    targetDir: string;
}
