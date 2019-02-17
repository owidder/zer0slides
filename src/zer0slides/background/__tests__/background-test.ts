import {_addFilterToStyle} from "../background";

describe("background", () => {
    it("should add filter when there is a filter", () => {
        const currentStyle = "x: y; filter: opacity(10%); a: b;";
        expect(_addFilterToStyle(currentStyle, "blur(3px)")).toEqual("x: y; filter: opacity(10%) blur(3px); a: b;")
    })

    it("should add filter when there is no filter", () => {
        const currentStyle = "x: y; a: b;";
        expect(_addFilterToStyle(currentStyle, "blur(3px)")).toEqual("x: y; a: b; filter: blur(3px);")
        expect(_addFilterToStyle(null, "blur(3px)")).toEqual("filter: blur(3px);")
        expect(_addFilterToStyle("", "blur(3px)")).toEqual("filter: blur(3px);")
    })
})