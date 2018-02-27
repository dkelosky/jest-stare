import * as $ from "jquery";
import { Switch } from "../../../../src/render/navigation/Switch";

describe("Switch tests", () => {

    it("should change classes shown when toggled", () => {

        // <div id="test" class="example">
        const div = document.createElement("div") as HTMLDivElement;
        const divId = "test";
        div.id = divId;
        const toggleClass = "example";
        div.classList.add(toggleClass);
        div.textContent = "some message";
        document.body.appendChild(div);

        // <input type="checkbox" id="checkbox">
        const checkbox = document.createElement("input") as HTMLInputElement;
        checkbox.checked = true;
        checkbox.type = "checkbox";
        checkbox.id = "checkbox";
        document.body.appendChild(checkbox);

        // div should be visible
        let displayed = $("#" + divId).css("display");
        expect(displayed).not.toBe("none");

        // create our switch
        const navSwitch = new Switch($(checkbox) as JQuery<HTMLInputElement>, $("." + toggleClass) as JQuery<HTMLDivElement>);

        // uncheck & div should be hidden
        $("#checkbox").prop("checked", false).trigger("change");
        displayed = $("#" + divId).css("display");
        expect(displayed).toBe("none");

        // check & div should be visible
        $("#checkbox").prop("checked", true).trigger("change");
        displayed = $("#" + divId).css("display");
        expect(displayed).not.toBe("none");
    });
});
