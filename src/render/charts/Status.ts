/**
 * Handle setting status colors for test results
 * @export
 * @class Status
 */
export class Status {

    /**
     * Update status based on number of passed tests
     * @private
     * @param {JQuery<HTMLParagraphElement>} statusElement - element to update
     * @param {number} passed - number of passed tests
     * @param {number} total - total tests
     * @memberof Status
     */
    public static setResultsClass(statusElement: JQuery<HTMLParagraphElement>, passed: number, failed: number) {

        const total: number = passed + failed;

        if (total === 0) {
            statusElement.addClass("list-group-item-info");
        } else {
            if (passed === 0) {
                statusElement.addClass("list-group-item-danger");
            } else if (passed === total) {
                statusElement.addClass("list-group-item-success");
            } else {
                statusElement.addClass("list-group-item-warning");
            }
        }

    }

}
