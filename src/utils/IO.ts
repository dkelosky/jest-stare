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
        return new Promise<void>( (resolve, reject) => {
            fs.writeFile(path, data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }
}
