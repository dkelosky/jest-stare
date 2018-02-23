import * as diff2html from "diff2html";
/**
 * Generate a side by side comparison of Jest snapshot differences
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

    public static generate(jestFailureMessage: any): string {
        const jestDiff = TestDifference.isolateDiff(jestFailureMessage);
        
        return diff2html.Diff2Html.getPrettyHtml(
            jestDiff,
            {
                inputFormat: "diff",
                showFiles: false,
                outputFormat: "side-by-side",
                matching: "lines"
            }
        );
    }

    public static isolateDiff(jestFailureMessage: string): string {
        const beginIndex = jestFailureMessage.search(TestDifference.DIFF_INDICATOR);
        const endIndex = jestFailureMessage.search(TestDifference.DIFF_END_INDICATOR);
        let isolated = jestFailureMessage.substring(beginIndex, endIndex);
        const changesIndicator = "\n@@ -1035,6 +1035,17\n"; // todo: find a way to get accurate numbers?
        isolated = isolated.replace("- Snapshot", "--- Snapshot");
        isolated = isolated.replace("+ Received\n", "+++ Received" + changesIndicator);
        return isolated;
    }
}
