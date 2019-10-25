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
     * Label for pending tests
     * @static
     * @memberof Constants
     */
    public static readonly PENDING_LABEL = "Pending";

    /**
     * Label for obsolete info
     * @static
     * @memberof Constants
     */
    public static readonly OBSOLETE_SNAPSHOT_TEST_LABEL = "Obsolete Test";

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
     * Label for removed snapshot tests
     * @static
     * @memberof Constants
     */
    public static readonly UPDATED_SNAPSHOT_TEST_LABEL = "Updated Snapshot Test";

    /**
     * Label for removed snapshot files
     * @static
     * @memberof Constants
     */
    public static readonly REMOVED_OBSOLETE_SNAPSHOT_FILE_LABEL = "Removed Obsolete Snapshot File";

    /**
     * Label for removed info
     * @static
     * @memberof Constants
     */
    public static readonly OBSOLETE_SNAPSHOT_FILE_LABEL = "Obsolete File";

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
     * Obsolete snapshot file
     * @static
     * @memberof Constants
     */
    public static readonly OBSOLETE_SNAPSHOT_FILE = "#f8f9fa"; // btn-light

    /**
     * Obsolete color
     * @static
     * @memberof Constants
     */
    public static readonly OBSOLETE_SNAPSHOT_TEST = "#ffc107"; // btn-warning

    /**
     * Added color
     * @static
     * @memberof Constants
     */
    public static readonly ADDED = "#007bff"; // btn-primary

    /**
     * Removed snapshot test color
     * @static
     * @memberof Constants
     */
    public static readonly UPDATED_SNAPSHOT_TEST = "#17a2b8"; // btn-info

    /**
     * Removed snapshot file color
     * @static
     * @memberof Constants
     */
    public static readonly REMOVED_OBSOLETE_SNAPSHOT_FILE = "#343a40"; // btn-dark

    /**
     * Changed color
     * @static
     * @memberof Constants
     */
    public static readonly CHANGED = "#6c757d"; // btn-secondary

    /**
     * Pass color
     * @static
     * @memberof Constants
     */
    public static readonly PASS_RAW = "28a745"; // btn-success
    public static readonly PASS = "#" + Constants.PASS_RAW;

    /**
     * Fail color
     * @static
     * @memberof Constants
     */
    public static readonly FAIL_RAW = "dc3545"; // btn-danger
    public static readonly FAIL = "#" + Constants.FAIL_RAW;

    /**
     * Pending color
     * @static
     * @memberof Constants
     */
    public static readonly PENDING_RAW = "ffc107";
    public static readonly PENDING = "#" + Constants.PENDING_RAW; // btn-warning

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
     * Pending test class
     * @static
     * @memberof Constants
     */
    public static readonly PENDING_TEST = "pending-test";
}
