describe("Failing Tests", () => {

    describe("Snapshot differences", () => {
        it("should fail with a small snapshot difference", () => {
            const jsonObject: any = {
                name: "ein",
                breed: "corgi",
                height: 1,
                color: "brown and white"
            };
            expect(JSON.stringify(jsonObject, null, 2)).toMatchSnapshot();
        });

        it("should fail with a large snapshot difference", () => {
            const jsonObject: any = {
                a: "aardvark",
                b: "balogna",
                c: "cat",
                d: "dog",
                e: "egg",
                f: "frog",
                g: "gecko",
                h: "hyena",
                i: "ice cream",
                j: "jackal",
                k: "koala",
                l: "lemon",
                m: "magpie",
                n: "newt",
                o: "oolong tea",
                p: "parrot",
                q: "quack"
            };
            expect(JSON.stringify(jsonObject, null, 2)).toMatchSnapshot();
        });

        it("should fail with an error snapshot difference", ()=>{
            expect(()=>{
                throw new Error("Here is the new error.\nIt contains various new "+
                "information such as how to write on a computer\n," +
                "and a reminder to scrape an avocado onto your toast.");
            }).toThrowErrorMatchingSnapshot();
        });

    it("should fail due to an error", () => {
        throw new Error("This is an error failure");
    });

    it("Should fail due to a bad expectation", () => {
        expect(false).toEqual(true);
    })
    });
});
