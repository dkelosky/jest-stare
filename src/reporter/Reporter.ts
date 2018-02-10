import GlobalConfig = jest.GlobalConfig;

/**
 * Class to implement basic reporter methods
 * @export
 * @class Reporter
 */
export class Reporter {

    /**
     * Creates an instance of Reporter.
     * @param {GlobalConfig} mGlobalConfig - jest global config
     * @param {*} mOptions - jest options in effect
     * @memberof Reporter
     */
    constructor(private mGlobalConfig: GlobalConfig, private mOptions: any) {
    }

    public onRunComplete(contexts: any, results: any) {
        console.log("Custom reporter output:");
        console.log("GlobalConfig: ", this.mGlobalConfig);
        console.log("Options: ", this.mOptions);
    }
}
