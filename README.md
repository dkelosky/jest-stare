# Jest HTML Reporter
Jest HTML reporter for people that hate plain-text.  Strictly speaking, this is a
"testResultsProcessor" only.  It takes the summary tests results and parses into 
an HTML file for readability. 

This package does include a reporter component; however, that piece is disabled.

## Usage
`jest --testResultsProcessor=jest-stare`

Or

`"testResultsProcessor": "./node_modules/jest-html-reporter",`

## WIP
This is a work in progress project and contributions are welcome.  

## Testing

### First time setup
1. `git clone` this repo
2. `npm install`
3. `npm install browserify -g`
4. `npm install typescript -g`
5. `npm install jest -g`

### Try example
1. `tsc`
2. `npm run make`
3. `jest --reporters=./` OR `jest Reporter.test.ts --reporters=./`

### Screenshot
![alt text](images/sample.png "Sample Report - WIP")

##  To Do
* fix lint
* link coverage if used
* snapshots updated, added, etc
* test
* travis
* coveralls
* publish