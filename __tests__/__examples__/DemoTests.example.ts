const fs = require('fs');
const path = require('path');

describe("Demonstrate a jest-stare report", () => {
    it("should be pending", () => {
        pending();
    });

    it("should pass", () => {
        // do nothing
    });

    it("should fail with mismatched snapshot", () => {
        expect({ firstKey: "firstValue", secondKey: "wrongValue" }).toMatchSnapshot();
    });

    it("should pass with snapshot", () => {
        expect({firstKey: "firstValue", secondKey: "secondValue"}).toMatchSnapshot();
    });

    it("should add a snapshot", () => {
        expect("randomString").toMatchSnapshot();
    });

    it("should pass with image snapshot", () => {
        const referenceImage = path.resolve(__dirname, 'reference_images', 'A.png');
        const imageAtTest = fs.readFileSync(referenceImage);

        expect(imageAtTest).toMatchImageSnapshot();
    });

    it("should fail with image snapshot", () => {
        //Stored snapshot is for A.png, so should fail
        const referenceImage = path.resolve(__dirname, 'reference_images', 'B.png');
        const imageAtTest = fs.readFileSync(referenceImage);

        expect(imageAtTest).toMatchImageSnapshot();
    });
});
