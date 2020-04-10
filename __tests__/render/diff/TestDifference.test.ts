import * as $ from "jquery";
import { TestDifference } from "../../../src/render/diff/TestDifference";
import * as diff2html from "diff2html";

jest.mock("diff2html")

const example =
    "Error: expect(received).toMatchSnapshot()\n" +
    "Snapshot name: `Failing Tests Snapshot differences should fail with a small snapshot difference 1`\n" +
    "- Snapshot  - 2\n" +
    "+ Received  + 2\n" +
    "  {" +
    "-   \"name\": \"floppy\",\n" +
    "+   \"name\": \"Amet ad commodo ad aliquip elit excepteur laboris. Aliqua consequat exercitation Lorem incididunt esse nulla eiusmod labore eu magna consequat enim enim dolore. Do in reprehenderit qui sint aliquip quis tempor laborum sint quis.Deserunt sunt veniam magna eiusmod adipisicing incididunt pariatur incididunt elit dolore nostrud sit nostrud. Mollit eu ut ea irure consectetur quis. Ullamco aliqua laboris ipsum et laboris in culpa in ea et do. Velit qui ullamco tempor excepteur aute duis exercitation consectetur deserunt enim.Reprehenderit veniam qui eiusmod ipsum consectetur non. Sint nulla Lorem esse fugiat quis deserunt consequat consequat deserunt sunt qui. Officia commodo irure Lorem dolore qui mollit. Consequat ea tempor occaecat ex irure consequat dolore minim ipsum. Occaecat dolor consequat cupidatat consequat.\",\n" +
    "-   \"breed\": \"beagle\",\n" +
    "+   \"breed\": \"corgi\",\n" +
    "    \"height\": 1,\n" +
    "    \"color\": \"brown and white\"\n" +
    "  }\n" +
    "    at Object.it (C:\dev\node\jeststarebackup\__tests__\__examples__\FailingTests.example.ts:11:57)\n" +
    "    at Object.asyncJestTest (C:\dev\node\jeststarebackup\node_modules\jest\node_modules\jest-jasmine2\build\jasmineAsyncInstall.js:100:37)\n" +
    "    at resolve (C:\dev\node\jeststarebackup\node_modules\jest\node_modules\jest-jasmine2\build\queueRunner.js:45:12)\n" +
    "    at new Promise (<anonymous>)\n" +
    "    at mapper (C:\dev\node\jeststarebackup\node_modules\jest\node_modules\jest-jasmine2\build\queueRunner.js:28:19)\n" +
    "    at promise.then (C:\dev\node\jeststarebackup\node_modules\jest\node_modules\jest-jasmine2\build\queueRunner.js:75:41)\n" +
    "    at process._tickCallback (internal/process/next_tick.js:68:7)\n";

const example2 =
    "Error: expect(value).toMatchSnapshot()\n" +
    "Received value does not match stored snapshot 1.\n" +
    "- Snapshot\n" +
    "+ Received\n" +
    "  Object {\n" +
    "    \"firstKey\": \"firstValue\",\n" +
    "-   \"secondKey\": \"secondValue\",\n" +
    "+   \"secondKey\": \"wrongValue\",\n" +
    "  }\n" +
    "    at Object.it (C:\Dev\node\jest-stare\__tests__\__examples__\DemoTests.example.ts:11:69)\n" +
    "    at Object.asyncFn (C:\Dev\node\jest-stare\node_modules\jest-config\node_modules\jest-jasmine2\build\jasmine_async.js:129:432)\n" +
    "    at resolve (C:\Dev\node\jest-stare\node_modules\jest-config\node_modules\jest-jasmine2\build\queue_runner.js:51:12)\n" +
    "    at new Promise (<anonymous>)\n" +
    "    at mapper (C:\Dev\node\jest-stare\node_modules\jest-config\node_modules\jest-jasmine2\build\queue_runner.js:40:274)\n" +
    "    at promise.then (C:\Dev\node\jest-stare\node_modules\jest-config\node_modules\jest-jasmine2\build\queue_runner.js:83:39)\n" +
    "    at <anonymous>\n" +
    "    at process._tickCallback (internal/process/next_tick.js:188:7)\n";


describe("TestDifference tests", () => {
    it("should return false if no diff", () => {
        expect(TestDifference.containsDiff("no diff here")).toBe(false);
    });

    it("should return true if diff", () => {
        expect(TestDifference.containsDiff("- Snapshot  - 3\n+ Received  + 3")).toBe(true);
    });

    it("should return true if diff for old version", () => {
        expect(TestDifference.containsDiff("- Snapshot\n+ Received")).toBe(true);
    });

    it("should return isolated diff", () => {
        const resp = (TestDifference as any).isolateDiff(example);
        expect(resp).toMatchSnapshot();
    });

    it("should return isolated diff for older version", () => {
        const resp = (TestDifference as any).isolateDiff(example2);
        expect(resp).toMatchSnapshot();
    });
});

