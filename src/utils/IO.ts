import * as fs from "fs";
import * as path from "path";

const pkgUp = require("pkg-up");

/**
 * class for simple IO
 * @export
 * @class IO
 */
export class IO {

    /**
     * Delete a file if it exists
     * @static
     * @param {string} file - file to delete
     * @memberof IO
     */
    public static unlinkSync(file: string) {
        if (IO.existsSync(file)) {
            fs.unlinkSync(file);
        }
    }

    /**
     * Wrap fs.writeFile for promise-based calling
     * @static
     * @param {string} wpath - place to write to
     * @param {*} data - content to write
     * @returns {Promise<void>} - when write is complete
     * @memberof IO
     */
    public static writeFile(wpath: string, data: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.writeFile(wpath, data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    /**
     * Wrap fs.writeFile for promise-based calling
     * @static
     * @param {string} wpath - place to write to
     * @param {*} data - content to write
     * @returns {Promise<void>} - when write is complete
     * @memberof IO
     */
    public static writeFileSync(wpath: string, data: any) {
        fs.writeFileSync(wpath, data);
    }
    /**
     * Create a directory if it does not yet exist synchronously.
     * @param  {string} dir - directory to create
     * @return {undefined}
     * @memberof IO
     */
    public static mkDirSync(dir: string) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    /**
     * Make directories (recursive)
     * @static
     * @param {string} dir - directory to make
     * @memberof IO
     */
    public static mkdirsSync(dir: string) {

        // we're splitting on a specific separator character, so replace \ with /
        // before splitting
        const dirs = path.resolve(dir).replace(/\\/g, "/").split("/");

        let createDir: string = "";
        for (const crDir of dirs) {

            createDir += (crDir + "/");
            IO.mkDirSync(createDir);
        }
    }

    /**
     * Read file and return to caller
     * @static
     * @param {string} wpath - path to read file
     * @returns - file contents
     * @memberof IO
     */
    public static readFileSync(wpath: string) {
        return fs.readFileSync(wpath).toString();
    }

    /**
     * Return whether a given file already exists
     * @static
     * @param {string} wpath - path of file to check
     * @returns - true if file exists, false otherwise
     * @memberof IO
     */
    public static existsSync(wpath: string) {
        return fs.existsSync(wpath);
    }

    /**
     * Read from the user's package.json, if present
     * @static
     * @returns {IJestStareConfig} - config object
     * @returns {object} - full package JSON
     * @memberof IO
     */
    public static readPackageJson(): object {
        const packageJson = pkgUp.sync();
        if (packageJson !== null) {
            return JSON.parse(IO.readFileSync(packageJson));
        } else {
            // if we can't find any package.json, return a blank config
            return {};
        }
    }

    /**
     * Copy src file to dest file.
     *
     * @param src
     * @param dest
     */
    public static copyFileSync(src: fs.PathLike, dest: fs.PathLike): void {
        fs.copyFileSync(src, dest);
    }
}
