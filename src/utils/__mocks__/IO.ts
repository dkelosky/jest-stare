import * as fs from "fs";

/**
 * class for simple IO
 * @export
 * @class IO
 */
export class IO {

    public static writeFile(path: string, data: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }

    public static writeFileSync(path: string, data: any) {
        return;
    }

    public static mkdirsSync(dir: string) {
        return;
    }

    public static readFileSync(path: string) {
        return "{}";
    }

    public static existsSync(path: string) {
        return true;
    }

    public static readPackageJson(): object {
        return {};
    }
}
