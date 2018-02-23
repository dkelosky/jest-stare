describe("Failing Tests", () => {

    it("should fail with a snapshot difference", () => {
      // change this object to fail the test
        const jsonObject: any = {
            name: "fluffo",
            breed: "beagle",
            height: 2,
            color: "brown and white"
        };
 
        expect(JSON.stringify(jsonObject,null, 2)).toMatchSnapshot();
    });
});
