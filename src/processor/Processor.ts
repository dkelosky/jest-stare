import { IResultsProcessorInput } from "./doc/IResultsProcessorInput";
import { inspect } from "util";
import { ISubstitute } from "../reporter/doc/ISubstitute";
import { IO } from "../utils/IO";
import * as mustache from "mustache";
import * as path from "path";
import { IJestStareConfig, PACKAGE_JSON_KEY } from "./doc/IJestStareConfig";
import { Logger } from "../utils/Logger";
import * as chalk from "chalk";
const pkgUp = require("pkg-up");

/**
 * Class to post process jest output and summarize information in an html file
 * @export
 * @class Processor
 */
export class Processor {

    /**
     * Main exported method to obtain and return summary results
     * @static
     * @param {IResultsProcessorInput} results - input results object
     * @returns - returns input results object
     * @memberof Processor
     */
    public static resultsProcessor(results: IResultsProcessorInput) {
        const substitute: ISubstitute = {};

        const config = Processor.readPackageJson();

        substitute.results = results;
        substitute.rawResults = JSON.stringify(results);

        const resultDirectory = config.resultDir == null ? "./jest-stare" : config.resultDir;
        Processor.generateReport(resultDirectory, substitute);

        return results;
    }

    /**
     * Create HTML report
     * @private
     * @param {string} resultDir -  directory to save report
     * @param {ISubstitute} substitute - substitution values for mustache render
     * @memberof Processor
     */
    private static generateReport(resultDir: string, substitute: ISubstitute) {
        resultDir = resultDir + "/"; // append an extra slash in case the user didn't add one
        const cssDir = resultDir + "css/";
        const jsDir = resultDir + "js/";

        const main = "index.html";

        IO.mkdirsSync(resultDir);
        IO.mkdirsSync(jsDir);
        IO.mkdirsSync(cssDir);

        const html = Processor.obtainWebFile("template.html");
        const rendered = mustache.render(html, substitute);

        IO.writeFile(resultDir + main, rendered);

        const logger = Logger.get;
        logger.prefix = false;
        const logo = chalk.default.green("**  ") + chalk.default.green("jest") + chalk.default.yellow("-") + chalk.default.red("stare");
        logger.debug(logo + " --testResultsProcessor: wrote output report to " + resultDir + main +
            chalk.default.green("\t**"));

        const mainCss = "jest-stare.css";
        const css = Processor.obtainWebFile(mainCss);
        IO.writeFile(cssDir + mainCss, css);

        const mainJs = "view.js";
        const js = Processor.obtainJsFile(mainJs);
        IO.writeFile(jsDir + mainJs, js);

        // TODO(Kelosky): encapsulate this loading / copying in some helper routine
        const bootstrapCssPath = require.resolve("bootstrap/dist/css/bootstrap.min.css");
        const bootstrapCssContent = IO.readFileSync(bootstrapCssPath);
        IO.writeFile(cssDir + "bootstrap.min.css", bootstrapCssContent);

        const bootstrapJsPath = require.resolve("bootstrap/dist/js/bootstrap.min.js");
        const bootstrapJsContent = IO.readFileSync(bootstrapJsPath);
        IO.writeFile(jsDir + "bootstrap.min.js", bootstrapJsContent);

        const diff2htmlCssPath = require.resolve("diff2html/dist/diff2html.min.css");
        const diff2htmlCssContent = IO.readFileSync(diff2htmlCssPath);
        IO.writeFile(cssDir + "diff2html.min.css", diff2htmlCssContent);

        const diff2htmlJsPath = require.resolve("diff2html/dist/diff2html.min.js");
        const diff2htmlJsContent = IO.readFileSync(diff2htmlJsPath);
        IO.writeFile(jsDir + "diff2html.min.js", diff2htmlJsContent);

        const jqueryPath = require.resolve("jquery/dist/jquery.min.js");
        const jqueryContent = IO.readFileSync(jqueryPath);
        IO.writeFile(jsDir + "jquery.min.js", jqueryContent);

        const holderPath = require.resolve("holderjs/holder.js");
        const holderContent = IO.readFileSync(holderPath);
        IO.writeFile(jsDir + "holder.js", holderContent);
    }

    /**
     * Obtain web files
     * @private
     * @returns {string} - file contents from web directory
     * @memberof Processor
     */
    private static obtainWebFile(name: string): string {
        return IO.readFileSync(path.resolve(__dirname + "/../../web/" + name));
    }

    /**
     * Obtain js files
     * @private
     * @returns {string} - js file contents from js directory
     * @memberof Processor
     */
    private static obtainJsFile(name: string): string {
        return IO.readFileSync(path.resolve(__dirname + "/../render/" + name));
    }

    /**
     * Read from the user's package.json, if present
     * @private
     * @static
     * @returns {IJestStareConfig} - config object
     * @memberof Processor
     */
    private static readPackageJson(): IJestStareConfig {
        const packageJson = pkgUp.sync();
        if (packageJson !== null) {
            const packageJsonContents = IO.readFileSync(packageJson).toString();
            const packageJsonObject = JSON.parse(packageJsonContents);
            if (packageJsonObject[PACKAGE_JSON_KEY] == null) {
                // package json found, but no jest stare config
                return {};
            } else {
                // found the user's package.json config
                return packageJsonObject[PACKAGE_JSON_KEY];
            }
        } else {
            // if we can't find any package.json, return a blank config
            return {};
        }

    }
}
