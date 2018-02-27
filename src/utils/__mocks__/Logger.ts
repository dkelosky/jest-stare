import { isNullOrUndefined } from "util";

export class Logger {
    private static mLog: Logger;

    public static get get() {
        if (isNullOrUndefined(this.mLog)) {
            this.mLog = new Logger();
        }
        return this.mLog;
    }

    public debug(message: string, ...args: any[]): string {
        return message;
    }
}
