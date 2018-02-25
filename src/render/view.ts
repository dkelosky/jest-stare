import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as $ from "jquery";
import { Render } from "./Render";
import { IResultsProcessorInput } from "../processor/doc/jest/IResultsProcessorInput";

// await for DOM load
document.addEventListener("DOMContentLoaded", () => {
    const results: IResultsProcessorInput = JSON.parse($("#test-results").text());
    new Render(results).init();
});
