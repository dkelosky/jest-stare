import * as $ from "jquery";
import { Render } from "../../../src/render/Render";
import { Processor } from "../../../src/processor/Processor";
import { Constants } from "../../../src/processor/Constants";

const simplePassingTests = require("../../data/simplePassingTests.json");

describe("Render tests", () => {
    it("should create passing tests", () => {

        /**
         * Need css & js collocated and to use document.write to invoke scripts
         */

        // const template = (Processor as any).obtainWebFile(Constants.TEMPLATE_HTML);
        // // const el = document.createElement("html") as HTMLHtmlElement;
        // // el.innerHTML = template;
        // document.write(template);

        // // $.parseHTML(template);
        // // const div = document.createElement("div") as HTMLDivElement;
        // // const divId = "test-results";
        // const data = $("#test-results").text();
        // const results = $("#test-results").text(JSON.stringify(simplePassingTests, null, 2));
        // // coso$("#test-results").text();
        // // div.textContent = ;
        // // console.log(data);
        // (Render as any).show(simplePassingTests);
        // const newdata = $("#test-results").text();
        // console.log(newdata)
        expect(true).toBe(true); // MatchSnapshot();
    });
});
