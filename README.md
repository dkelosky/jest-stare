# Jest HTML Reporter (Results Processor) [![Build Status](https://travis-ci.org/dkelosky/jest-stare.svg?branch=master)](https://travis-ci.org/dkelosky/jest-stare) [![jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/facebook/jest) [![npm](https://img.shields.io/badge/npm-v5.6.0-blue.svg)](https://www.npmjs.com/package/jest-stare)
This is a Jest HTML reporter (technically a "results processor") based primarily on:
* [jQuery](https://jquery.com/)
* [Bootstrap](https://getbootstrap.com/)
* [Holder.js](http://holderjs.com/)
* [Chart.js](http://www.chartjs.org/)
* [diff2html](https://diff2html.xyz/)

See [package.json](/package.json) dependencies for a full list of dependencies that make up `jest-stare`.

jest-stare takes the summary tests results and parses them into an HTML file for improved readability and filtering. 

## Usage
`jest --testResultsProcessor=jest-stare`

Or

`"testResultsProcessor": "./node_modules/jest-stare",`

## Config 
Thanks to [dogboydog](https://github.com/dogboydog) you can configure the default output location of the jest-stare html files in your package.json via:
```
jest-stare: {
    "resultDir": "results/jest-stare"
}
```

## Status
This is a work in progress project and contributions / suggestions are welcome.  

### Screenshot
Simple examples below.

#### Sample Report
![alt text](images/sample.png "Sample Report")

#### Sample Snapshot Diff
![alt text](images/snapshotSideBySideDiff.png "Snapshot diff")

##  To Do
* link coverage if used or custom coverage reporter
* note snapshots updated, added, etc
* increase coverage of this project
* refactor render class
* minify / bundle distribution
* capture invocation options & record / store raw test json data
* generate report from raw test json data
* add overall test time

## Development Building / Testing
If you'd like to submit a PR, here are some basic steps to test out code changes.

### First time setup
1. `git clone` this repo
2. `npm install`

### Try example
1. `npm run build`
2. `npx jest`
