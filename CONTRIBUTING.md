## Dev Testing

Development Building / Testing
If you'd like to submit a Pull Request, here are some basic steps to test out code changes.  Suggestions and improvements are welcome!

### First time setup

1. `git clone` this repo
2. `npm install`

### Build & Test

1. `npm run build`
2. `npm run test`

### Recreate a Report

If there is a problem with a certain HTML report rendering for some user, you can try to obtain their `jest-results.json` (see [README](/README.md#config)) and recreate the exact report via CLI invocation:

`node lib/jest-stare.js __tests__/resources/largeTests.json`

### Create a Test Report for Screenshots

Perhaps you want a report with forced failures to see what the UI would look like, you can do this by running tests in the `__examples__`,folder, for example:

`npm run build && jest --testRegex __tests__.*\\.example\\.ts$ Passing`

Or, you can use `npm run example` (which includes a build before creating a sample report).
