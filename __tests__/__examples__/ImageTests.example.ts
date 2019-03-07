import * as fs from "fs";
import * as path from "path";

describe("Demonstrate a jest-stare report with image diffs", () => {

    it("should pass with image snapshot", () => {
        const referenceImage = path.resolve(__dirname, "reference_images", "A.png");
        const imageAtTest = fs.readFileSync(referenceImage);

        expect(imageAtTest).toMatchImageSnapshot();
    });

    it("should fail with image snapshot", () => {
        // Stored snapshot is for A.png, so should fail
        const referenceImage = path.resolve(__dirname, "reference_images", "B.png");
        const imageAtTest = fs.readFileSync(referenceImage);

        expect(imageAtTest).toMatchImageSnapshot();
    });

    //To test multiple fails are handled correctly
    it("should fail with another image snapshot", () => {
        // Stored snapshot is for A-edited.png, so should fail
        const referenceImage = path.resolve(__dirname, "reference_images", "A.png");
        const imageAtTest = fs.readFileSync(referenceImage);

        expect(imageAtTest).toMatchImageSnapshot();
    });
});
