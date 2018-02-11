
/**
 * for HTML mustache rendering
 * @export
 * @interface ISubstitute
 */
export interface ISubstitute {

    /**
     * total test suites passed
     * @type {number}
     * @memberof ISubstitute
     */
    testSuitesPassed?: number;

    /**
     * total tests suites ran
     * @type {number}
     * @memberof ISubstitute
     */
    testSuitesTotal?: number;

    /**
     * total tests passed
     * @type {number}
     * @memberof ISubstitute
     */
    testsPassed?: number;

    /**
     * total tests ran
     * @type {number}
     * @memberof ISubstitute
     */
    testsTotal?: number;

    /**
     * total snapshots passed
     * @type {number}
     * @memberof ISubstitute
     */
    snapshotsPassed?: number;

    /**
     * total snapshot tests ran
     * @type {number}
     * @memberof ISubstitute
     */
    snapshotsTotal?: number;
}
