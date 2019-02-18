import {_addFilterToStyle, _replaceHueRotation} from "../background";

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

    it("should replace hue-rotate", () => {
        expect(_replaceHueRotation("a: b; filter: hue-rotate(19deg) opacity(20%); x:y;", 300))
            .toEqual("a: b; filter: hue-rotate(300deg) opacity(20%); x:y;");
        expect(_replaceHueRotation("a: b; x:y;", 300)).toEqual("a: b; x:y; filter: hue-rotate(300deg);");
    })
})