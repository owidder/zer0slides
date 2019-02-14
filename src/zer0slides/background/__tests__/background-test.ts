import {_addFilterToStyle} from "../background";

describe("background", () => {
    it("should add filter", () => {
        const currentStyle = "x: y; filter: opacity(10%); a: b;";
        _addFilterToStyle(currentStyle, "blur(3px)");
    })
})