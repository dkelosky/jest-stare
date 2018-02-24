describe("Mixed Passing and Failing Tests", () => {

    describe("Snapshot differences", () => {
        it("should fail with a snapshot difference", () => {
            const jsonObject: any = {
                name: "ein",
                breed: "corgi",
                height: 1,
                color: "brown and white"
            };
            expect(JSON.stringify(jsonObject, null, 2)).toMatchSnapshot();
        });
    });

    it("should fail due to an error", () => {
        throw new Error("This is an error failure");
    });

    it("Should fail due to a bad expectation", () => {
        expect(false).toEqual(true);
    })
});
