describe("Passing Tests", () => {

    describe("A category of tests", () => {
        it("should pass a snapshot comparison", () => {
            const jsonObject: any = {
                name: "fluffo",
                breed: "samoyed",
                height: 1,
                color: "white"
            };
            expect(JSON.stringify(jsonObject, null, 2)).toMatchSnapshot();
        });

        
    });

    
    it ("should pass an expect statement", ()=>{
        expect(true).toEqual(true);
    });

});
