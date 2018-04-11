describe("outer 0", () => {
    describe("outer 1", () => {
        describe("outer 2", () => {
            it("should pass", () => {
                // pass
            });
            describe("first outer 3", () => {
                describe("outer 4", () => {
                    it("should pass", () => {
                        //
                    });
                });
            });
            describe("outer 3", () => {
                describe("outer 4", () => {
                    it("should pass", () => {
                        //
                    });
                    it("should fail", () => {
                        expect(true).toBe(false);
                    });
                });
            });
            describe("next outer 3", () => {
                describe("outer 4", () => {
                    it("should pass", () => {
                        //
                    });
                    it("should fail", () => {
                        expect(true).toBe(false);
                    });
                });
            });
            describe("last outer 3", () => {
                describe("outer 4", () => {
                    it("should pass", () => {
                        //
                    });
                });
            });
        });
    });
});
