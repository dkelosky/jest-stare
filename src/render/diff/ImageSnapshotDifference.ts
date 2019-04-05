import * as $ from "jquery";
import { Constants } from "../../processor/Constants";
import * as AnsiParser from "ansi-parser";

/**
 * Generate a side by side comparison of Jest image snapshot differences
 * @export
 * @class ImageSnapshotDifference
 */
export class ImageSnapshotDifference {

    public static DIFF_INDICATOR: string[] = ["different from snapshot", "image to be the same size"];
    public static DIFF_IMAGE: RegExp = /See diff for details:\s*((.*?)\.png)/;
    public static DIFF_DETAILS: RegExp = /Error: (.*)/;

    /**
     * Test whether a failure message contains a image snapshot diff that we can render
     * @static
     * @param jestFailureMessage the failureMessage provided in the jest result object
     * @memberof TestDifference
     */
    public static containsDiff(jestFailureMessage: string): boolean {
        let isFailure = false;
        for (const indicator of ImageSnapshotDifference.DIFF_INDICATOR) {
          if (jestFailureMessage.indexOf(indicator) >= 0) {
            isFailure = true;
            break;
          }
        }

        return isFailure;
    }

    /**
     * Generate diff html from jest diff message
     * @static
     * @param {string} jestFailureMessage - jest failure message
     * @returns {HTMLElement} - html to contain diff error message and diff image which is link to full size diff
     * @memberof TestDifference
     */
    public static generate(jestFailureMessage: string): HTMLElement {
        const imageDiffFilename = ImageSnapshotDifference.parseDiffImageName(jestFailureMessage);
        const errorMessage = ImageSnapshotDifference.parseDiffError(jestFailureMessage);

        const diffDiv = document.createElement("div") as HTMLDivElement;
        diffDiv.className = "image-snapshot-diff";

        const diffMessage = document.createElement("span") as HTMLSpanElement;
        diffMessage.textContent = errorMessage;
        diffMessage.className = "text-muted";
        diffDiv.appendChild(diffMessage);

        const diffImageLink = document.createElement("a") as HTMLAnchorElement;
        diffImageLink.href = Constants.IMAGE_SNAPSHOT_DIFF_DIR + imageDiffFilename;
        diffDiv.appendChild(diffImageLink);

        const diffImage = document.createElement("img") as HTMLImageElement;
        diffImage.src = Constants.IMAGE_SNAPSHOT_DIFF_DIR + imageDiffFilename;
        diffImageLink.appendChild(diffImage);

        return $(diffDiv).get(0);
    }

    /**
     * Parse diff image file path from jest failure message.
     *
     * @param jestFailureMessage
     * @returns {string} - file path or null if file not detected.
     */
    public static parseDiffImagePath(jestFailureMessage: string): string {

        const match = ImageSnapshotDifference.DIFF_IMAGE.exec(jestFailureMessage);

        if (match) {
            return AnsiParser.removeAnsi(match[1]).trim();
        }

        return null;
    }

    /**
     * Parse diff image file name from jest failure message.
     *
     * @param jestFailureMessage
     * @returns {string} - file name or null if file not detected.
     */
    public static parseDiffImageName(jestFailureMessage: string): string {

        const path = ImageSnapshotDifference.parseDiffImagePath(jestFailureMessage);

        if (path) {
            return path.replace(/^.*[\\\/]/, "");
        }
    }

    /**
     * Parse diff error message from jest failure message.
     *
     * @param jestFailureMessage
     */
    private static parseDiffError(jestFailureMessage: string): string {

        const match = ImageSnapshotDifference.DIFF_DETAILS.exec(jestFailureMessage);

        if (match) {
            return match[1];
        }

        return null;
    }
}
