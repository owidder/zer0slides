import {plus1} from "../foo";

describe("foo", () => {
    it("plus1", () => {
        expect(plus1(1)).toEqual(2);
    })
})