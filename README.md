[![Build Status](https://travis-ci.org/dkelosky/jest-stare.svg?branch=master)](https://travis-ci.org/dkelosky/jest-stare) [![jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/facebook/jest) [![npm](https://img.shields.io/badge/npm-v5.6.0-blue.svg)](https://www.npmjs.com/package/jest-stare)

# Jest HTML Reporter (Results Processor)
This is a Jest HTML reporter (really a "results processor").  jest-stare takes the summary tests results and parses them into an 
HTML file for improved readability and filtering. 

It provides:
* filtering of passed / failed tests
* side-by-side snapshot diff
* chart-summarized information
* [api](#api)
* [cli](#cli)

This project is based primarily on:
* [jQuery](https://jquery.com/)
* [Bootstrap](https://getbootstrap.com/)
* [Holder.js](http://holderjs.com/)
* [Chart.js](http://www.chartjs.org/)
* [diff2html](https://diff2html.xyz/)

See [package.json](/package.json) dependencies for a full list of dependencies that make up `jest-stare`.

## Usage
`jest --testResultsProcessor=jest-stare`

Or

`"testResultsProcessor": "./node_modules/jest-stare",`

After invocation, by default, `./jest-stare` will contain:
* `index.html` - html report
* `jest-results.json` - raw jest json data

### Config 
Thanks to [dogboydog](https://github.com/dogboydog) you can configure the default output location of the jest-stare html files in your package.json via:
```
jest-stare: {
    "resultDir": "results/jest-stare"
}
```

Additionally, you can configure whether or not jest-stare should log to the console via:
```
jest-stare: {
    "log": "false"
}
```

### Screenshot
Simple examples below.

#### Sample Report
![alt text](images/sample.png "Sample Report")

#### Sample Snapshot Diff
![alt text](images/snapshotSideBySideDiff.png "Snapshot diff")

## Status
This is a work in progress project and contributions / suggestions are welcome.  

## API
You can programmatically invoke jest-stare and provide jest response data via:
```typescript
const simplePassingTests = require("../__tests__/data/simplePassingTests.json"); // example JSON data
const processor = require("jest-stare");

processor(simplePassingTests, {log: false, resultDir: __dirname + "/output"}); // first parm is jest json results, second is jest-stare config
```

## CLI
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

The command reponse takes a form of:
```
jest-stare was called with programmatic config
**  jest-stare --testResultsProcessor: wrote output report to c:/users/myId/desktop/output/index.html  **
```

## TODO
* link coverage if used or custom coverage reporter
* note snapshots updated, added, etc
* increase coverage of this project
* refactor render class
* minify / bundle distribution
* generate report from raw test json data
* add overall test time
* piping for CLI?

## Development Building / Testing
If you'd like to submit a PR, here are some basic steps to test out code changes.

### First time setup
1. `git clone` this repo
2. `npm install`

### Try example
1. `npm run build`
2. `npx jest`
