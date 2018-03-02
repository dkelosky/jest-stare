
/**
 * Holds chart data
 * @export
 * @interface IChartData
 */
export interface IChartData {

    /**
     * Label for same index data
     * @type {string[]}
     * @memberof IChartData
     */
    labels: string[];

    /**
     * Color for same index data
     * @type {string[]}
     * @memberof IChartData
     */
    backgroundColor: string[];

    /**
     * Raw data values
     * @type {number[]}
     * @memberof IChartData
     */
    data: number[];
}
