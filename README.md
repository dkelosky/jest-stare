[![Build Status](https://travis-ci.org/dkelosky/jest-stare.svg?branch=master)](https://travis-ci.org/dkelosky/jest-stare) [![jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/facebook/jest) [![npm](https://img.shields.io/badge/npm-v5.6.0-blue.svg)](https://www.npmjs.com/package/jest-stare)

# Jest HTML Reporter / Results Processor
This is a Jest HTML reporter (really a "results processor").  That is, it takes summary test results from jest
and parses into an HTML file for improved readability and filtering. 

![Sample](images/sampleReport.png "Sample Report")

## Features
It provides:
* filtering of passed / failed tests
* side-by-side snapshot diff
* doughnut chart-summarized information
* ability to pass test results to additional test results processors 
* capturing of raw jest results JSON file
* a link to generated coverage report (if configured)
* [configuration](#config) overrides
* [cli](#cli) - create `jest-stare` or other jest HTML reports from raw JSON results
* [api](#api)

This project is based on:
* [jQuery](https://jquery.com/)
* [Bootstrap](https://getbootstrap.com/)
* [Holder.js](http://holderjs.com/)
* [Chart.js](http://www.chartjs.org/)
* [diff2html](https://diff2html.xyz/)

## Usage
Run tests or a test with jest and specify `jest-stare` on the `--testResultsProcessor` option:
`jest --testResultsProcessor=jest-stare`

Or, add `testResultsProcessor` to `jest` config to specfy `jest-stare`:
`"testResultsProcessor": "./node_modules/jest-stare",`

By default, after a report is generated, the output will go to `./jest-stare` and will contain:
* `index.html` - html report
* `jest-results.json` - raw jest json data
* `/js` - javascript render files
* `/css` - css stylings

### Config 
Thanks to [dogboydog](https://github.com/dogboydog) for additions to configuration!

Currently, if you need to config `jest-stare`, do so by adding a `jest-stare` object to your package.json
```
jest-stare: {
    ...
}
```

Within this object you can configure the following fields:

Field | Default | Description | Example
--- | --- | --- | ---
`resultDir` | `jest-stare` | set the results directory | `"resultDir": "results/jest-stare"`
`additionalResultsProcessors` | `undefined` | add additional test result processors to produce multiple report |`"additionalResultsProcessors": ["jest-html-reporter", "jest-junit"]`
`log` | `true` | specify whether or not jest-stare should log to the console | `"log": "false"`
`resultHtml` | `index.html` | indicate the main html file name | `"resultHtml": "main.html"`
`resultJson` | `jest-results.json` | indicate the raw JSON results file name | `"resultJson": "data.json"`
`jestStareConfigJson` | `undefined` | request to save jest-stare config raw JSON results in the file name | `"jestStareConfigJson": "jest-stare-config.json"`
`coverageLink` | `undefined` | link to coverage report if available | `"coverageLink": "../../coverage/lcov-report/index.html"`

### API
You can programmatically invoke jest-stare and provide jest response data via:
```typescript
// require jest-stare
const processor = require("jest-stare");

// load some jest results JSON data
const simplePassingTests = require("../__tests__/data/simplePassingTests.json");

// call jest-stare processor, passing a first parm of the jest json results,
// and optionally a second parm of jest-stare config
processor(simplePassingTests, {log: false, resultDir: __dirname + "/output"});
```

### CLI
Use the `jest-stare` CLI to create or recreate the HTML report.  You only need a JSON
file containing the jest results from some test.  

You can invoke jest-stare as a CLI after installing globally via `npm install -g jest-stare`.  
Or if jest-stare is a local dependency you can invoke the CLI via `npx jest-stare...`

Assuming that you have a relative file to your current location in a folder "data" and 
simplePassingTests.json contains saved JSON output from a jest test invocation, you can
run the CLI providing a single positional input jest JSON file:
```
jest-stare data/simplePassingTests.json
```

Optionally you can control where the report will be stored using a a second positional:
```
jest-stare data/simplePassingTests.json c:/users/myId/desktop/output
```

The command response takes a form of:
```
jest-stare was called with programmatic config
**  jest-stare --testResultsProcessor: wrote output report to c:/users/myId/desktop/output/index.html  **
```
### Jest Watch
Because jest-stare writes *.js files when generating a report, you may get an infinite loop when using
`jest-stare` and `jest --watch`.  Samples of the problem are documented here:
* https://github.com/facebook/jest/issues/3923
* https://github.com/facebook/jest/issues/2516

To get around this problem, consider excluding `jest-stare` *.js files from watch via something like this:
```json
    "watchPathIgnorePatterns": [
      ".*jest-stare.*\\.js"
    ],
```

## Development Building / Testing
If you'd like to submit a Pull Request, here are some basic steps to test out code changes.  Suggestions and improvements are welcome!

### First time setup
1. `git clone` this repo
2. `npm install`

### Build & Test
1. `npm run build`
2. `npm run jest`

### Run an Example
You can create a report from tests in the `__tests__/example` by issuing: `jest --testRegex __tests__.*\\.example\\.ts`
Or, you can use `npm run example` (which includes a build before creating a sample report).
