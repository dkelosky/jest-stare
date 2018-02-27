import { isNullOrUndefined } from "util";

const stdout = jest.fn<string>((msg: string) => {
    return msg;
});

const stderr = jest.fn<string>((msg: string) => {
    return msg;
});

export class Logger {
    private static mLog: Logger;

    public static get get() {
        if (isNullOrUndefined(this.mLog)) {
            this.mLog = new Logger();
        }
        return this.mLog;
    }

    private writeStdout = stdout;

    private writeStderr = stderr;

    public debug(message: string, ...args: any[]): string {
        return this.writeStdout(message);
    }

    public error(message: string, ...args: any[]): string {
        return this.writeStderr(message);
    }
}
