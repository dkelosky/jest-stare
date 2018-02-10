export class Reporter {
    constructor(private mGlobalConfig: jest.GlobalConfig, private mOptions: any) {
    }

    public onRunComplete(contexts: any, results: any) {
        console.log("Custom reporter output:");
        console.log("GlobalConfig: ", this.mGlobalConfig);
        console.log("Options: ", this.mOptions);
    }
}
