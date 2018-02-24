/**
 * Jest interface
 * @export
 * @interface ISnapshot
 */
export interface ISnapshot {
    added: number;
    didUpdate: boolean;
    failure: boolean;
    filesAdded: number;
    filesRemoved: number;
    filesUnmatched: number;
    filesUpdated: number;
    matched: number;
    total: number;
    unchecked: number;
    uncheckedKeys: any[];
    unmatched: number;
    updated: number;
}
