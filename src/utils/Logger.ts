import { format, isNullOrUndefined } from "util";
import * as moment from "moment";
import * as chalk from "chalk";

/**
 * Class to contain writing log messages
 * @export
 * @class Logger
 */
export class Logger {

    /**
     * Supported levels of logging
     * @static
     * @memberof Logger
     */
    public static readonly LEVELS = ["trace", "debug", "info", "warn", "error", "fatal"];

    /**
     * Default log level
     * @static
     * @memberof Logger
     */
    public static readonly LEVEL_DEFAULT = "debug";

    /**
     * Obtain instance of logger
     * @readonly
     * @static
     * @memberof Logger
     */
    public static get get() {
        if (isNullOrUndefined(this.mLog)) {
            this.mLog = new Logger();
        }
        return this.mLog;
    }

    /**
     * Determine if level is valid
     * @static
     * @param {string} level - level to validate
     * @returns - true if level exists, false otherwise
     * @memberof Logger
     */
    public static isValidLevel(level: string) {
        return Logger.LEVELS.indexOf(level) < 0 ? false : true;
    }

    /**
     * Validate levels of logging
     * @static
     * @param {string} level - level to validate
     * @memberof Logger
     */
    public static validateLevel(level: string) {
        if (!Logger.isValidLevel(level)) {
            throw new Error("invalid level");
        }
    }

    /**
     * Static instance of logger object
     * @private
     * @static
     * @type {Logger}
     * @memberof Logger
     */
    private static mLog: Logger;

    /**
     * Whether or not to prefix log messages
     * @private
     * @type {boolean}
     * @memberof Logger
     */
    private mPrefix: boolean;

    /**
     * Whether or not to color log messages
     * @private
     * @type {boolean}
     * @memberof Logger
     */
    private mColor: boolean;

    /**
     * Whether or not logging should be suppressed
     * @private
     * @type {boolean}
     * @memberof Logger
     */
    private mIsOn: boolean;

    /**
     * Current set log level
     * @private
     * @type {string}
     * @memberof Logger
     */
    private mLevel: string;

    /**
     * Creates an instance of Logger.
     * @memberof Logger
     */
    constructor() {
        this.mLevel = Logger.LEVEL_DEFAULT;
        this.mPrefix = false;
        this.mColor = true;
        this.mLevel = this.mLevel.toLocaleLowerCase();
        this.mIsOn = true;
        Logger.validateLevel(this.mLevel);
    }

    public isDebugEnabled() {
        return Logger.LEVELS.indexOf("debug") >= Logger.LEVELS.indexOf(this.level) ? true : false;
    }

    public isErrorEnabled() {
        return Logger.LEVELS.indexOf("error") >= Logger.LEVELS.indexOf(this.level) ? true : false;
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
            adjustedMessage = chalk.default.blue(adjustedMessage);
        }
        return this.writeStdout(adjustedMessage, args);
    }

    public error(message: string, ...args: any[]) {
        if (!this.isErrorEnabled()) {
            return;
        }
        let adjustedMessage = message;
        if (this.prefix) {
            adjustedMessage = this.buildPrefix("ERROR") + message;
        }
        if (this.color) {
            adjustedMessage = chalk.default.red(adjustedMessage);
        }
        return this.writeStderr(adjustedMessage, args);
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
