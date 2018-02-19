import * as fs from "fs";

/**
 * class for simple IO
 * @export
 * @class IO
 */
export class IO {

    /**
     * Wrap fs.writeFile for promise-based calling
     * @static
     * @param {string} path - place to write to
     * @param {*} data - content to write
     * @returns {Promise<void>} - when write is complete
     * @memberof IO
     */
    public static writeFile(path: string, data: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }

    /**
     * Make directories (recursive)
     * @static
     * @param {string} dir - directory to make
     * @memberof IO
     */
    public static mkdirsSync(dir: string) {
        return;
    }

    /**
     * Read file and return to caller
     * @static
     * @param {string} path - path to read file
     * @returns - file contents
     * @memberof IO
     */
    public static readFileSync(path: string) {
        throw new Error("Mock read not implemented yet");
    }

    /**
     * Return whether a given file already exists
     * @static
     * @param {string} path - path of file to check
     * @returns - true if file exists, false otherwise
     * @memberof IO
     */
    public static existsSync(path: string) {
        return true;
    }
}
