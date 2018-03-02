/**
 * Constants for rendering
 * @export
 * @class Constants
 */
export class Constants {

    /**
     * Label for passed tests
     * @static
     * @memberof Constants
     */
    public static readonly PASSED_LABEL = "Passed";

    /**
     * Label for failed tests
     * @static
     * @memberof Constants
     */
    public static readonly FAILED_LABEL = "Failed";

    /**
     * Label for obsolete info
     * @static
     * @memberof Constants
     */
    public static readonly OBSOLETE_LABEL = "Obsolete";

    /**
     * Label for changed info
     * @static
     * @memberof Constants
     */
    public static readonly CHANGED_LABEL = "Changed";

    /**
     * Label for added info
     * @static
     * @memberof Constants
     */
    public static readonly ADDED_LABEL = "Added";

    /**
     * Passed jest status
     * @static
     * @memberof Constants
     */
    public static readonly TEST_STATUS_PASS = "passed";

    /**
     * Failed jest status
     * @static
     * @memberof Constants
     */
    public static readonly TEST_STATUS_FAIL = "failed";

    /**
     * Pending jest status
     * @static
     * @memberof Constants
     */
    public static readonly TEST_STATUS_PEND = "pending";

    /**
     * Obsolete color
     * @static
     * @memberof Constants
     */
    public static readonly OBSOLETE = "#ffc107";

    /**
     * Added color
     * @static
     * @memberof Constants
     */
    public static readonly ADDED = "#007bff";

    /**
     * Changed color
     * @static
     * @memberof Constants
     */
    public static readonly CHANGED = "#6c757d";

    /**
     * Pass color
     * @static
     * @memberof Constants
     */
    public static readonly PASS_RAW = "28a745";
    public static readonly PASS = "#" + Constants.PASS_RAW;

    /**
     * Fail color
     * @static
     * @memberof Constants
     */
    public static readonly FAIL_RAW = "dc3545";
    public static readonly FAIL = "#" + Constants.FAIL_RAW;

    /**
     * Passed test class
     * @static
     * @memberof Constants
     */
    public static readonly PASSED_TEST = "passed-test";

    /**
     * Failed test class
     * @static
     * @memberof Constants
     */
    public static readonly FAILED_TEST = "failed-test";

    /**
     * Both passed and failed test class
     * @static
     * @memberof Constants
     */
    public static readonly BOTH_TEST = "both-test";
}
