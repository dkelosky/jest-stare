// test/Runner
// run via jest greeter.test.ts
import { GlobalConfig } from "jest";
export class MyCustomReporter {
    constructor(private mGlobalConfig: any, private mOptions: any) {
    }

    public onRunComplete(contexts: any, results: any) {
        console.log("Custom reporter output:");
        console.log("GlobalConfig: ", this.mGlobalConfig);
        console.log("Options: ", this.mOptions);
    }
}

module.exports = MyCustomReporter;