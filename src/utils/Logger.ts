import { format, isNullOrUndefined } from "util";
import * as moment from "moment";

export class Logger {

    public static readonly LEVELS = ["trace", "debug", "info", "warn", "error", "fatal"];
    public static readonly LEVEL_DEFAULT = "debug";

    public static get get() {
        if (isNullOrUndefined(this.mLog)) {
            this.mLog = new Logger();
        }
        return this.mLog;
    }

    public static isValidLevel(level: string) {
        return Logger.LEVELS.indexOf(level) < 0 ? false : true;
    }

    public static validateLevel(level: string) {
        if (!Logger.isValidLevel(level)) {
            throw new Error("invalid level");
        }
    }

    private static mLog: Logger;
    private mPrefix: boolean;
    private mColor: boolean;
    private mIsOn: boolean;
    private mLevel: string;

    constructor() {
        this.mLevel = Logger.LEVEL_DEFAULT;
        this.mPrefix = true;
        this.mColor = true;
        this.mLevel = this.mLevel.toLocaleLowerCase();
        this.mIsOn = true;
        Logger.validateLevel(this.mLevel);
    }

    public isDebugEnabled() {
        return Logger.LEVELS.indexOf("debug") >= Logger.LEVELS.indexOf(this.level) ? true : false;
    }

    public debug(message: string, ...args: any[]) {
        if (!this.isDebugEnabled()) {
            return;
        }
        let adjustedMessage = message;
        if (this.prefix) {
            adjustedMessage = this.buildPrefix("DEBUG") + message;
        }
        if (this.color) {
            // adjustedMessage = TextUtils.chalk.blue(adjustedMessage);
        }
        return this.writeStdout(adjustedMessage, args);
    }

    private writeStderr(message: string, ...args: any[]) {
        const data = this.format(message, args);
        if (this.on) {
            process.stderr.write(this.format(message, args));
        }
        return data;
    }

    private writeStdout(message: string, ...args: any[]) {
        const data = this.format(message, args);
        if (this.on) {
            process.stdout.write(data);
        }
        return data;
    }

    private format(data: string, ...args: any[]) {
        let formatted = data;
        // TODO(Kelosky): this is not ideal, but works for simple cases of
        // .debug(%s, "sub string").
        if (this.formatEnabled && !isNullOrUndefined(args) && args.length > 0) {
            let defined = false;
            args.forEach((arg) => {
                arg.forEach((ntry: string[]) => {
                    if (ntry.length > 0) {
                        defined = true;
                    }
                });
            });
            // if every argument is undefined, dont format it
            if (defined) {
                formatted = format(data, args);
            }
        }
        return formatted + "\n";
    }

    private buildPrefix(type: string) {
        return "[" + moment().format("YYYY/MM/DD HH:MM:SS") + "]" + " " + "[" + type + "]" + " ";
    }

    get formatEnabled() {
        return true;
    }

    set color(isEnabled: boolean) {
        this.mColor = isEnabled;
    }

    get color(): boolean {
        return this.mColor;
    }

    set on(isOn: boolean) {
        this.mIsOn = isOn;
    }

    get on() {
        return this.mIsOn;
    }

    get level() {
        return this.mLevel;
    }

    get prefix(): boolean {
        return this.mPrefix;
    }

    set prefix(prefix) {
        this.mPrefix = prefix;
    }
}
