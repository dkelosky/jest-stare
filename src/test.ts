const simplePassingTests = require("../__tests__/data/simplePassingTests.json");
const processor = require("./");

processor(simplePassingTests, { log: true, resultDir: __dirname + "/output"});
