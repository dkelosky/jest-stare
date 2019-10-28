import { isNullOrUndefined } from "util";

/**
 * Associates a switch (checkbox) to a class to show if checked or hide if unchecked)
 * @export
 * @class Switch
 */
export class Switch {

    /**
     * Ancestor title join character (We need to escape the "." in order to jquery to get the class correctly)
     * @static
     * @memberof Switch
     */
    public static readonly JOIN_CHAR = "\\.";

    /**
     * Activate checkbox listeners to filter on passed or failed tests
     * @private
     * @param {string} currentStatus - status being appended to oldStatus
     * @param {string} oldStatus - old status
     * @returns {string} - Join the status, ordered alphabetically
     * @memberof Switch
     */
    private static mixStatus(currentStatus: string, oldStatus: string) {
        const statusArray = oldStatus.split(Switch.JOIN_CHAR);
        statusArray.push(currentStatus);
        const sortedUniqueStatusArray = [...new Set(statusArray)].sort();
        return sortedUniqueStatusArray.join(Switch.JOIN_CHAR);
    }

    /**
     * Creates an instance of Switch.
     * @param {JQuery<HTMLInputElement>} checkBox - checkbox to listen to
     * @param {JQuery<HTMLDivElement>} divClass - class to hide if checkbox is unchecked
     * @param {string} divClassName - when evaluating multiple checkbox, we use this to check the mixed classes
     * @param {Array<JQuery<HTMLInputElement>>} addtnlCheckBoxArray - other checkboxes to evaluate
     * @param {string[]} addtnlClassNameArray - when evaluating multiple checkbox, this are the other classes to mix
     * @memberof Switch
     */
    constructor(
        checkBox: JQuery<HTMLInputElement>, divClass: JQuery<HTMLDivElement>, divClassName?: string,
        addtnlCheckBoxArray?: Array<JQuery<HTMLInputElement>>, addtnlClassNameArray?: string[]) {
            this.activateFilters(checkBox, divClass, divClassName, addtnlCheckBoxArray, addtnlClassNameArray);
    }

    /**
     * Activate checkbox listeners to filter on passed or failed tests
     * @private
     * @param {JQuery<HTMLInputElement>} checkBox - checkbox to listen to
     * @param {JQuery<HTMLDivElement>} divClass - class to hide if checkbox is unchecked
     * @param {string} divClassName - when evaluating multiple checkbox, we use this to check the mixed classes
     * @param {Array<JQuery<HTMLInputElement>>} addtnlCheckBoxArray - other checkboxes to evaluate
     * @param {string[]} addtnlClassNameArray - when evaluating multiple checkbox, this are the other classes to mix
     * @memberof Switch
     */
    private activateFilters(
        checkBox: JQuery<HTMLInputElement>, divClass: JQuery<HTMLDivElement>, divClassName?: string,
        addtnlCheckBoxArray?: Array<JQuery<HTMLInputElement>>, addtnlClassNameArray?: string[]) {
            checkBox.change(() => {
                if (checkBox.is(":checked")) {
                    divClass.show();
                    if (!isNullOrUndefined(addtnlCheckBoxArray)) {
                        addtnlCheckBoxArray.forEach((addtnlCheckBox, index) => {
                            const mixedDualClass = Switch.mixStatus(addtnlClassNameArray[index], divClassName);
                            const mixedClassDiv = $("." + mixedDualClass) as JQuery<HTMLDivElement>;
                            mixedClassDiv.show();
                        });

                        const mixedClass = Switch.mixStatus(addtnlClassNameArray[0], divClassName);
                        const allMixedClass = Switch.mixStatus(addtnlClassNameArray[1], mixedClass);
                        const allMixedClassDiv =  $("." + allMixedClass) as JQuery<HTMLDivElement>;
                        allMixedClassDiv.show();
                    }
                } else {
                    divClass.hide();
                    if (!isNullOrUndefined(addtnlCheckBoxArray)) {
                        let allUnchecked = true;
                        addtnlCheckBoxArray.forEach((addtnlCheckBox, index) => {
                            if (!addtnlCheckBox.is(":checked")) {
                                const mixedClass = Switch.mixStatus(addtnlClassNameArray[index], divClassName);
                                const mixedClassDiv = $("." + mixedClass) as JQuery<HTMLDivElement>;
                                mixedClassDiv.hide();
                            } else {
                                allUnchecked = false;
                            }
                        });

                        if (allUnchecked) {
                            const mixedClass = Switch.mixStatus(addtnlClassNameArray[0], divClassName);
                            const allMixedClass = Switch.mixStatus(addtnlClassNameArray[1], mixedClass);
                            const allMixedClassDiv =  $("." + allMixedClass) as JQuery<HTMLDivElement>;
                            allMixedClassDiv.hide();
                        }
                    }
                }
            });
    }
}
