import { IResultsProcessorInput } from "../../processor/doc/IResultsProcessorInput";


/**
 * for HTML mustache rendering
 * @export
 * @interface ISubstitute
 */
export interface ISubstitute {

    /**
     * Full test content
     * @type {IResultsProcessorInput}
     * @memberof ISubstitute
     */
    results?: IResultsProcessorInput;

    /**
     * This probably isn't needed, but this is what is serialized
     * @type {string}
     * @memberof ISubstitute
     */
    rawResults?: string;
}
