import { Constants } from "../Constants";
import { IInnerTestResults } from "../../processor/doc/jest/IInnerTestResults";
import * as AnsiParser from "ansi-parser";
import { TestDifference } from "../diff/TestDifference";


/**
 * Individual sections of report look like this
 */

// <div class="my-3 p-3 bg-white rounded box-shadow">
//     <h6 class="border-bottom border-gray pb-2 mb-0">Suggestions</h6>
//     <div class="media text-muted pt-3">
//         <img data-src="holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded">
//         <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
//             <div class="d-flex justify-content-between align-items-center w-100">
//                 <strong class="text-gray-dark">Full Name</strong>
//                 <a href="#">Follow</a>
//             </div>
//             <span class="d-block">@username</span>
//         </div>
//     </div>
//     <div class="media text-muted pt-3">
//         <img data-src="holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded">
//         <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
//             <div class="d-flex justify-content-between align-items-center w-100">
//                 <strong class="text-gray-dark">Full Name</strong>
//                 <a href="#">Follow</a>
//             </div>
//             <span class="d-block">@username</span>
//         </div>
//     </div>
//     <div class="media text-muted pt-3">
//         <img data-src="holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded">
//         <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
//             <div class="d-flex justify-content-between align-items-center w-100">
//                 <strong class="text-gray-dark">Full Name</strong>
//                 <a href="#">Follow</a>
//             </div>
//             <span class="d-block">@username</span>
//         </div>
//     </div>
//     <small class="d-block text-right mt-3">
//         <a href="#">All suggestions</a>
//     </small>
// </div>

/**
 * Create elements for a test
 * @export
 * @class Test
 */
export class Test {

    /**
     * Add test to a section of the presented table
     * @static
     * @param {IInnerTestResults} innerTestResult - see object description
     * @param {HTMLDivElement} element - base element to add to
     * @returns {HTMLDivElement} - populated element
     * @memberof Test
     */
    public static create(innerTestResult: IInnerTestResults): HTMLElement {
        let color = Constants.PASS_RAW;
        let testStatusClass = Constants.PASSED_TEST;
        let failed = false;

        switch (innerTestResult.status) {
            case Constants.TEST_STATUS_FAIL:
                color = Constants.FAIL_RAW;
                testStatusClass = Constants.FAILED_TEST;
                failed = true;
                break;
            case Constants.TEST_STATUS_PEND:
                break;
            case Constants.TEST_STATUS_PASS:
                break;
            default:
                break;
        }

        const firstDiv = document.createElement("div") as HTMLDivElement;
        firstDiv.classList.add("media", "text-muted", "pt-3", testStatusClass);

        const img = document.createElement("img") as HTMLImageElement;
        img.classList.add("mr-2", "rounded");
        img.alt = "";

        img.setAttribute("data-src", "holder.js/32x32?theme=thumb&bg=" + color + "&fg=" + color + "&size=1");

        firstDiv.appendChild(img);

        const secondDiv = document.createElement("div") as HTMLDivElement;
        secondDiv.classList.add("media-body", "pb-3", "mb-0", "small", "lh-125", "border-bottom", "border-gray");

        firstDiv.appendChild(secondDiv);

        const thirdDiv = document.createElement("div") as HTMLDivElement;
        thirdDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "w-100");

        secondDiv.appendChild(thirdDiv);

        const strong = document.createElement("strong") as HTMLElement;
        strong.classList.add("text-gray-dark");
        strong.textContent = innerTestResult.title;

        // NOTE(Kelosky): technically, this may not be unique, but it's unlikely to be the case
        const titleId = innerTestResult.title.replace(/\s+/g, "-").toLowerCase();
        thirdDiv.appendChild(strong);

        //     <small class="d-block text-right mt-3">
        //         <a href="#">All suggestions</a>
        //     </small>
        const small = document.createElement("small") as HTMLElement;
        small.classList.add("d-block", "text-right", "mt-3");
        const conversionValu = 1000;
        small.textContent = innerTestResult.duration / conversionValu + "s";

        thirdDiv.appendChild(small);
        // const anchor = document.createElement("a") as HTMLAnchorElement;
        // anchor.href = "#";
        // anchor.classList.add("disabled");
        // anchor.textContent = "Expand";

        // thirdDiv.appendChild(anchor);

        const span = document.createElement("span") as HTMLSpanElement;
        span.classList.add("d-block", "mb-2");
        span.textContent = innerTestResult.status;

        secondDiv.appendChild(span);

        if (failed) {

            const failMessage: string = AnsiParser.removeAnsi(innerTestResult.failureMessages[0]);
            const failMessageSplit = failMessage.split("\n");

            let show = true;

            // does the failure message contain a snapshot difference?
            if (failMessage.search(TestDifference.DIFF_INDICATOR) >= 0) {
                // const codeSpan = document.createElement("span") as HTMLSpanElement;
                const diffHtml = TestDifference.generate(failMessage);
                // const spanDiv = document.createElement("div") as HTMLDivElement;
                // spanDiv.appendChild(codeSpan);
                secondDiv.appendChild(diffHtml);
                show = false;
            }
            // <button class="btn btn-primary" type = "button"
            // data - toggle="collapse" data - target="#collapseExample" aria - expanded="false" aria - controls="collapseExample" >
            //     Button with data - target
            //     < /button>

            // <div class="d-flex justify-content-between align-items-center w-100" >
            //     <strong class="text-gray-dark" > Full Name < /strong>
            //         < a href = "#" > Follow < /a>
            //             < /div>


            const collapseDiv = document.createElement("div") as HTMLDivElement;
            collapseDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "w-100");
            const worthlessDiv = document.createElement("div") as HTMLDivElement;
            secondDiv.appendChild(collapseDiv);
            collapseDiv.appendChild(worthlessDiv);

            const button = document.createElement("button") as HTMLButtonElement;
            button.classList.add("btn", "btn-light", "btn-sm");
            button.type = "button";
            button.setAttribute("data-toggle", "collapse");
            button.setAttribute("data-target", "#" + titleId);
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-controls", titleId);
            button.textContent = "raw";
            collapseDiv.appendChild(button);

            const pre = document.createElement("pre") as HTMLPreElement;
            secondDiv.appendChild(pre);
            pre.classList.add("collapse");
            if (show) {
                pre.classList.add("show");
            }
            pre.id = titleId;

            const code = document.createElement("code") as HTMLElement;
            pre.appendChild(code);


            // else {
            // non-diff failure message
            failMessageSplit.forEach((entry, index) => {
                const codeSpan = document.createElement("span") as HTMLSpanElement;
                if (entry[0] === "+") {
                    codeSpan.setAttribute("style", "color:" + Constants.PASS);
                    codeSpan.textContent = entry;
                } else if (entry[0] === "-") {
                    codeSpan.setAttribute("style", "color:" + Constants.FAIL);
                    codeSpan.textContent = entry;
                } else {
                    codeSpan.textContent = entry;
                }
                const spanDiv = document.createElement("div") as HTMLDivElement;
                spanDiv.appendChild(codeSpan);
                code.appendChild(spanDiv);
            });
            // }

            const failMessageJoin = failMessageSplit.join("\n");
        }

        return firstDiv;
    }
}
