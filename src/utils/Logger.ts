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
    public static readonly LEVEL_DEFAULT = "info";

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

    /**
     * Return whether ot not trace level logging is enabled
     * @returns {boolean} - true if level is enabled
     * @memberof Logger
     */
    public isTraceEnabled(): boolean {
        return Logger.LEVELS.indexOf("trace") >= Logger.LEVELS.indexOf(this.level) ? this.on : false;
    }

    /**
     * Return whether ot not debug level logging is enabled
     * @returns {boolean} - true if level is enabled
     * @memberof Logger
     */
    public isDebugEnabled(): boolean {
        return Logger.LEVELS.indexOf("debug") >= Logger.LEVELS.indexOf(this.level) ? this.on : false;
    }

    /**
     * Return whether ot not info level logging is enabled
     * @returns {boolean} - true if level is enabled
     * @memberof Logger
     */
    public isInfoEnabled(): boolean {
        return Logger.LEVELS.indexOf("info") >= Logger.LEVELS.indexOf(this.level) ? this.on : false;
    }

    /**
     * Return whether ot not warn level logging is enabled
     * @returns {boolean} - true if level is enabled
     * @memberof Logger
     */
    public isWarnEnabled(): boolean {
        return Logger.LEVELS.indexOf("wanr") >= Logger.LEVELS.indexOf(this.level) ? this.on : false;
    }

    /**
     * Return whether ot not error level logging is enabled
     * @returns {boolean} - true if level is enabled
     * @memberof Logger
     */
    public isErrorEnabled(): boolean {
        return Logger.LEVELS.indexOf("error") >= Logger.LEVELS.indexOf(this.level) ? this.on : false;
    }

    /**
     * Return whether ot not fatal level logging is enabled
     * @returns {boolean} - true if level is enabled
     * @memberof Logger
     */
    public isFatalEnabled(): boolean {
        return Logger.LEVELS.indexOf("fatal") >= Logger.LEVELS.indexOf(this.level) ? this.on : false;
    }

    /**
     * Trace level message
     * @param {string} message - message to write
     * @param {...any[]} args - arguments for the message
     * @returns {string} - data written
     * @memberof Logger
     */
    public trace(message: string, ...args: any[]): string {
        if (!this.isTraceEnabled()) {
            return;
        }
        let adjustedMessage = message;
        if (this.prefix) {
            adjustedMessage = this.buildPrefix("TRACE") + message;
        }
        if (this.color) {
            adjustedMessage = chalk.default.cyan(adjustedMessage);
        }
        return this.writeStdout(adjustedMessage, args);
    }

    /**
     * Debug level message
     * @param {string} message - message to write
     * @param {...any[]} args - arguments for the message
     * @returns {string} - data written
     * @memberof Logger
     */
    public debug(message: string, ...args: any[]): string {
        if (!this.isDebugEnabled()) {
            return;
        }
        let adjustedMessage = message;
        if (this.prefix) {
            adjustedMessage = this.buildPrefix("DEBUG") + message;
        }
        if (this.color) {
            adjustedMessage = chalk.default.green(adjustedMessage);
        }
        return this.writeStdout(adjustedMessage, args);
    }

    /**
     * Info level message
     * @param {string} message - message to write
     * @param {...any[]} args - arguments for the message
     * @returns {string} - data written
     * @memberof Logger
     */
    public info(message: string, ...args: any[]): string {
        if (!this.isInfoEnabled()) {
            return;
        }
        let adjustedMessage = message;
        if (this.prefix) {
            adjustedMessage = this.buildPrefix("INFO") + message;
        }
        if (this.color) {
            adjustedMessage = chalk.default.blue(adjustedMessage);
        }
        return this.writeStdout(adjustedMessage, args);
    }

    /**
     * Warns level message
     * @param {string} message - message to write
     * @param {...any[]} args - arguments for the message
     * @returns {string} - data written
     * @memberof Logger
     */
    public warn(message: string, ...args: any[]): string {
        if (!this.isWarnEnabled()) {
            return;
        }
        let adjustedMessage = message;
        if (this.prefix) {
            adjustedMessage = this.buildPrefix("WARN") + message;
        }
        if (this.color) {
            adjustedMessage = chalk.default.yellow(adjustedMessage);
        }
        return this.writeStderr(adjustedMessage, args);
    }

    /**
     * Error level message
     * @param {string} message - message to write
     * @param {...any[]} args - arguments for the message
     * @returns {string} - data written
     * @memberof Logger
     */
    public error(message: string, ...args: any[]): string {
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

    /**
     * Fatal level message
     * @param {string} message - message to write
     * @param {...any[]} args - arguments for the message
     * @returns {string} - data written
     * @memberof Logger
     */
    public fatal(message: string, ...args: any[]): string {
        if (!this.isFatalEnabled()) {
            return;
        }
        let adjustedMessage = message;
        if (this.prefix) {
            adjustedMessage = this.buildPrefix("FATAL") + message;
        }
        if (this.color) {
            adjustedMessage = chalk.default.magenta(adjustedMessage);
        }
        return this.writeStderr(adjustedMessage, args);
    }

    /**
     * Write to stderr
     * @private
     * @param {string} message - message to write
     * @param {...any[]} args - arguments for the message
     * @returns {string} - data written
     * @memberof Logger
     */
    private writeStderr(message: string, ...args: any[]): string {
        const data = this.format(message, args);
        process.stderr.write(this.format(message, args));
        return data;
    }

    /**
     * Write to stdout
     * @private
     * @param {string} message - message to write
     * @param {...any[]} args - arguments for the message
     * @returns {string} - data written
     * @memberof Logger
     */
    private writeStdout(message: string, ...args: any[]): string {
        const data = this.format(message, args);
        process.stdout.write(data);
        return data;
    }

    /**
     * Formats a message for argument substitution
     * @private
     * @param {string} data - message to write
     * @param {...any[]} args - arguments for the message
     * @returns {string} - substituted strong
     * @memberof Logger
     */
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

    /**
     * Build a message prefix
     * @private
     * @param {string} type - type for this message prefix (e.g. DEBUG)
     * @returns {string} - built prefix
     * @memberof Logger
     */
    private buildPrefix(type: string) {
        return "[" + moment().format("YYYY/MM/DD HH:MM:SS") + "]" + " " + "[" + type + "]" + " ";
    }

    /**
     * Get whether or not format is enabled
     * @readonly
     * @memberof Logger
     */
    get formatEnabled() {
        return true;
    }

    /**
     * Set whether or not color is enabled
     * @memberof Logger
     */
    set color(isEnabled: boolean) {
        this.mColor = isEnabled;
    }

    /**
     * Get whether or not color is enabled
     * @type {boolean}
     * @memberof Logger
     */
    get color(): boolean {
        return this.mColor;
    }

    /**
     * Set whether or not logging should occur
     * @memberof Logger
     */
    set on(isOn: boolean) {
        this.mIsOn = isOn;
    }

    /**
     * Get if logging is on
     * @memberof Logger
     */
    get on() {
        return this.mIsOn;
    }

    /**
     * Get current logging level
     * @readonly
     * @memberof Logger
     */
    get level() {
        return this.mLevel;
    }

    /**
     * Get whether or not messages are prefixed
     * @type {boolean}
     * @memberof Logger
     */
    get prefix(): boolean {
        return this.mPrefix;
    }

    /**
     * Set whether ot not to prefix messages
     * @memberof Logger
     */
    set prefix(prefix) {
        this.mPrefix = prefix;
    }
}
