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

    it("should change classes shown when toggled and change classes for a second toggle too", () => {

        // <div id="test" class="example">
        const div = document.createElement("div") as HTMLDivElement;
        const divId = "test";
        div.id = divId;
        const toggleClass = "example";
        div.classList.add(toggleClass);
        div.textContent = "some message";
        document.body.appendChild(div);

        // <div id="test" class="addtnl-example">
        const addtnlDiv = document.createElement("div") as HTMLDivElement;
        const addtnlDivId = "addtnl-test";
        addtnlDiv.id = addtnlDivId;
        const addtnlToggleClass = "addtnl-example";
        addtnlDiv.classList.add(addtnlToggleClass);
        addtnlDiv.textContent = "some addtnl message";
        document.body.appendChild(addtnlDiv);

        // <input type="checkbox" id="checkbox">
        const checkbox = document.createElement("input") as HTMLInputElement;
        checkbox.checked = true;
        checkbox.type = "checkbox";
        checkbox.id = "checkbox";
        document.body.appendChild(checkbox);

        // <input type="checkbox" id="addtnl-checkbox">
        const addtnlCheckbox = document.createElement("input") as HTMLInputElement;
        addtnlCheckbox.checked = true;
        addtnlCheckbox.type = "checkbox";
        addtnlCheckbox.id = "addtnl-checkbox";
        document.body.appendChild(addtnlCheckbox);

        // div should be visible
        let displayed = $("#" + divId).css("display");
        expect(displayed).not.toBe("none");

        // addtnlDiv should be visible
        let addtnlDisplayed = $("#" + addtnlDivId).css("display");
        expect(addtnlDisplayed).not.toBe("none");

        // create our switch
        const navSwitch = new Switch(
            $(checkbox) as JQuery<HTMLInputElement>,
            $("." + toggleClass) as JQuery<HTMLDivElement>,
            $(addtnlCheckbox) as JQuery<HTMLInputElement>,
            $("." + addtnlToggleClass) as JQuery<HTMLDivElement>);

        // uncheck & div should be hidden
        $("#checkbox").prop("checked", false).trigger("change");
        displayed = $("#" + divId).css("display");
        expect(displayed).toBe("none");

        // addtnlDiv should be visible
        addtnlDisplayed = $("#" + addtnlDivId).css("display");
        expect(addtnlDisplayed).not.toBe("none");

        // uncheck addtnlCheckbox & addtnlDiv should be hidden
        $("#addtnl-checkbox").prop("checked", false).trigger("change");

        // check & div should be visible
        $("#checkbox").prop("checked", true).trigger("change");
        displayed = $("#" + divId).css("display");
        expect(displayed).not.toBe("none");

        displayed = $("#" + addtnlDivId).css("display");
        expect(displayed).not.toBe("none");

        // addtnlDiv should be visible
        addtnlDisplayed = $("#" + addtnlDivId).css("display");
        expect(addtnlDisplayed).not.toBe("none");
    });
});
