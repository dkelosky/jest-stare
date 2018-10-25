describe("Failing Tests", () => {

    describe("Snapshot differences", () => {
        it("should fail with a small snapshot difference", () => {
            const jsonObject: any = {
                name: "Amet ad commodo ad aliquip elit excepteur laboris. Aliqua consequat exercitation Lorem incididunt esse nulla eiusmod labore eu magna consequat enim enim dolore. Do in reprehenderit qui sint aliquip quis tempor laborum sint quis.Deserunt sunt veniam magna eiusmod adipisicing incididunt pariatur incididunt elit dolore nostrud sit nostrud. Mollit eu ut ea irure consectetur quis. Ullamco aliqua laboris ipsum et laboris in culpa in ea et do. Velit qui ullamco tempor excepteur aute duis exercitation consectetur deserunt enim.Reprehenderit veniam qui eiusmod ipsum consectetur non. Sint nulla Lorem esse fugiat quis deserunt consequat consequat deserunt sunt qui. Officia commodo irure Lorem dolore qui mollit. Consequat ea tempor occaecat ex irure consequat dolore minim ipsum. Occaecat dolor consequat cupidatat consequat.",
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

        it("should fail with an error snapshot difference", () => {
            expect(() => {
                throw new Error("Here is the new error.\nIt contains various new " +
                    "information such as how to write on a computer\n," +
                    "and a reminder to scrape an avocado onto your toast.");
            }).toThrowErrorMatchingSnapshot();
        });

        it("should fail due to an error", () => {
            throw new Error("This is an error failure");
        });

        it("Should fail due to a bad expectation", () => {
            expect(false).toEqual(true);
        });
    });
});
