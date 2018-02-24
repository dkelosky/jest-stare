describe("Failing Tests", () => {

    it("should fail with a snapshot difference", () => {
        const jsonObject: any = {
            name: "test",
            breed: "beagle",
            height: 1,
            color: "brown and yellow"
        };
        expect(JSON.stringify(jsonObject, null, 2)).toMatchSnapshot();
    });

    it("should be a placeholder", () => {
        expect(true).toBe(true);
    });

    it("should fail without a snapshot difference", () => {
        expect(true).toBe(false);
    });
});
