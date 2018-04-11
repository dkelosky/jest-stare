import * as $ from "jquery";
import { Status } from "../../../src/render/charts/Status";
describe("Status tests", () => {

    it("should set proper class for passed tests", () => {
        const p = document.createElement("p") as HTMLParagraphElement;
        document.body.appendChild(p);
        Status.setResultsClass($(p) as JQuery<HTMLParagraphElement>, 1, 0);
        expect(p.classList.item(0)).toMatchSnapshot();
    });

    it("should set proper class for failed tests", () => {
        const p = document.createElement("p") as HTMLParagraphElement;
        document.body.appendChild(p);
        Status.setResultsClass($(p) as JQuery<HTMLParagraphElement>, 0, 1);
        expect(p.classList.item(0)).toMatchSnapshot();
    });

    it("should set proper class for passed and failed tests", () => {
        const p = document.createElement("p") as HTMLParagraphElement;
        document.body.appendChild(p);
        Status.setResultsClass($(p) as JQuery<HTMLParagraphElement>, 1, 2);
        expect(p.classList.item(0)).toMatchSnapshot();
    });
});
