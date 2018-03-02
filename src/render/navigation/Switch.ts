import { isNullOrUndefined } from "util";

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
     * @param {JQuery<HTMLInputElement>} addtnlCheckBox - additional check box to listen to
     * @param {JQuery<HTMLDivElement>} addtnlDivClass - additional div to hide of additional checkbox is off
     * @memberof Switch
     */
    constructor(
        checkBox: JQuery<HTMLInputElement>, divClass: JQuery<HTMLDivElement>,
        addtnlCheckBox?: JQuery<HTMLInputElement>, addtnlDivClass?: JQuery<HTMLDivElement>) {
            this.activateFilters(checkBox, divClass, addtnlCheckBox, addtnlDivClass);
    }

    /**
     * Activate checkbox listeners to filter on passed or failed tests
     * @private
     * @param {JQuery<HTMLInputElement>} checkBox - checkbox element
     * @param {JQuery<HTMLDivElement>} divClass - class to toggle showing / hiding
     * @param {JQuery<HTMLInputElement>} addtnlCheckBox - additional check box to listen to
     * @param {JQuery<HTMLDivElement>} addtnlDivClass - additional div to hide of additional checkbox is off
     * @memberof Switch
     */
    private activateFilters(
        checkBox: JQuery<HTMLInputElement>, divClass: JQuery<HTMLDivElement>,
        addtnlCheckBox?: JQuery<HTMLInputElement>, addtnlDivClass?: JQuery<HTMLDivElement>) {
            checkBox.change(() => {
                if (checkBox.is(":checked")) {
                    divClass.show();
                    if (!isNullOrUndefined(addtnlCheckBox) && !addtnlCheckBox.is(":checked")) {
                        addtnlDivClass.show();
                    }
                } else {
                    divClass.hide();
                    if (!isNullOrUndefined(addtnlCheckBox) && !addtnlCheckBox.is(":checked")) {
                        addtnlDivClass.hide();
                    }
                }
            });
    }
}
