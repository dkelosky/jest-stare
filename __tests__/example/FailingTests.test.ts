describe("Failing Tests", () => {

    it("should fail with a snapshot difference", () => {
        const jsonObject: any = {
            name: "pointy",
            breed: "corgi",
            height: 2,
            color: "brown and white"
        };
        expect(JSON.stringify(jsonObject,null, 2)).toMatchSnapshot();
    });
});