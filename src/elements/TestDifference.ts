import * as diff2html from "diff2html";
import * as $ from "jquery";

/**
 * Generate a side by side comparison of Jest snapshot differences
 * @export
 * @class TestDifference
 */
export class TestDifference {

    /**
     * If this appears in a failure message, it is the beginning of a snapshot
     * diff.
     */
    public static DIFF_INDICATOR: RegExp = /- Snapshot\s*\n\s*\+ Received/g;

    public static DIFF_END_INDICATOR: RegExp = /(at .*? \(.*?:[0-9]+:[0-9]+\)\s)/g;

    /**
     * Test whether a failure message contains a diff that we can render
     * @param jestFailureMessage the failureMessage provided in the jest result object
     */
    public static containsDiff(jestFailureMessage: string): boolean {
        return jestFailureMessage.search(TestDifference.DIFF_INDICATOR) >= 0;
    }

    /**
     * Generate diff html from jest diff message
     * @static
     * @param {string} jestFailureMessage - jest failure message
     * @returns {HTMLElement} - diff2html built html
     * @memberof TestDifference
     */
    public static generate(jestFailureMessage: string): HTMLElement {
        const jestDiff = TestDifference.isolateDiff(jestFailureMessage);

        const diffHtml = diff2html.Diff2Html.getPrettyHtml(
            jestDiff,
            {
                inputFormat: "diff",
                showFiles: false,
                outputFormat: "side-by-side",
                matching: "lines"
            }
        );

        return $(diffHtml).get(0); // jquery iz kewl
    }

    public static isolateDiff(jestFailureMessage: string): string {
        const beginIndex = jestFailureMessage.search(TestDifference.DIFF_INDICATOR);
        const endIndex = jestFailureMessage.search(TestDifference.DIFF_END_INDICATOR);
        let isolated = jestFailureMessage.substring(beginIndex, endIndex);

        // get a rough count of the changes in the file
        let snapshotChanges = 0;
        let receivedChanges = 0;
        const changeLines = isolated.split(/\r?\n/g);
        for (const line of changeLines) {
            if (/^- /.test(line)) {
                snapshotChanges++;
            } else if (/^\+ /.test(line)) {
                receivedChanges++;
            }
        }
        const changesIndicator = `\n@@ -0,${snapshotChanges} +0,${receivedChanges} @@\n`;
        isolated = isolated.replace("- Snapshot", "--- Snapshot");
        isolated = isolated.replace("+ Received\n", "+++ Received" + changesIndicator);
        return isolated;
    }
}
