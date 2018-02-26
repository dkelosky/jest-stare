/**
 * Associates a switch (checkbox) to a class to show if checked or hide if unchecked)
 * @export
 * @class Switch
 */
export class Switch {

    /**
     * Creates an instance of Switch.
     * @param {JQuery<HTMLInputElement>} checkBox - checkbox to listen to
     * @param {JQuery<HTMLDivElement>} divClass - class to hide if checkbox is unchecked
     * @memberof Switch
     */
    constructor(checkBox: JQuery<HTMLInputElement>, private divClass: JQuery<HTMLDivElement>) {
        this.activateFilters(checkBox, divClass);
    }

    /**
     * Activate checkbox listeners to filter on passed or failed tests
     * @private
     * @param {JQuery<HTMLInputElement>} checkBox - checkbox element
     * @param {JQuery<HTMLDivElement>} divClass - class to toggle showing / hiding
     * @memberof Render
     */
    private activateFilters(checkBox: JQuery<HTMLInputElement>, divClass: JQuery<HTMLDivElement>) {
        checkBox.change(() => {
            if (checkBox.is(":checked")) {
                divClass.show();
            } else {
                divClass.hide();
            }
        });
    }
}
