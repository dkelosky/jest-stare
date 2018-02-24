import { IThirdPartyDependency } from "./doc/IThirdPartyDependency";
import { Constants } from "./Constants";

/**
 * Describe all third party dependencies - note, these must still be added to template manually for now
 * @export
 * @class Dependencies
 */
export class Dependencies {

    /**
     * All third party dependencies are here
     * @static
     * @type {IThirdPartyDependency[]}
     * @memberof Dependencies
     */
    public static readonly THIRD_PARTY_DEPENDENCIES: IThirdPartyDependency[] = [

        // js
        {
            requireDir: "bootstrap/dist/js/",
            file: "bootstrap.min.js",
            targetDir: Constants.JS_DIR
        },
        {
            requireDir: "diff2html/dist/",
            file: "diff2html.min.js",
            targetDir: Constants.JS_DIR
        },
        {
            requireDir: "jquery/dist/",
            file: "jquery.min.js",
            targetDir: Constants.JS_DIR
        },
        {
            requireDir: "holderjs/",
            file: "holder.js",
            targetDir: Constants.JS_DIR
        },

        // css
        {
            requireDir: "bootstrap/dist/css/",
            file: "bootstrap.min.css",
            targetDir: Constants.CSS_DIR
        },
        {
            requireDir: "diff2html/dist/",
            file: "diff2html.min.css",
            targetDir: Constants.CSS_DIR
        },
    ];
}
