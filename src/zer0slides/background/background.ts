import {q, selector} from "../selector/selector";

const BACKGROUND_IMAGE_CLASS = "_background_image_";

const image = (selector: string, imgPath: string) => {

    const backgroundContainer = document.querySelector(q(selector));
    const currentClass = backgroundContainer.getAttribute("class");
    const currentStyle = backgroundContainer.getAttribute("style") || "";
    backgroundContainer.setAttribute("class", `${currentClass} ${BACKGROUND_IMAGE_CLASS}`);
    backgroundContainer.setAttribute("style", `${currentStyle} background-image: url("${imgPath}");`);
}

export const _addFilterToStyle = (currentStyle: string, filter: string): string => {
    if(currentStyle && currentStyle.length > 0) {
        const filterRegex = /(^.*)filter\:(.*?);(.*)$/;
        if(filterRegex.test(currentStyle)) {
            const currentFilterMatch = currentStyle.match(filterRegex);
            return `${currentFilterMatch[1]}filter:${currentFilterMatch[2]} ${filter};${currentFilterMatch[3]}`;
        }

        return `${currentStyle} filter: ${filter};`
    }

    return `filter: ${filter};`;
}

const _addFilterToElement = (selector: string, filter: string) => {
    console.log(q(selector))
    const element = document.querySelector(q(selector));
    const currentStyle = element.getAttribute("style");
    const newStyle = _addFilterToStyle(currentStyle, filter);
    element.setAttribute("style", newStyle);
}

const opacity = (selector: string, percent: number) => {
    _addFilterToElement(selector, `opacity(${percent}%)`);
}

const blur = (selector: string, px: number) => {
    _addFilterToElement(selector, `blur(${px}px)`);
}

const saturate = (selector: string, percent: number) => {
    _addFilterToElement(selector, `saturate(${percent}%)`)
}

export const background = {
    image,
    opacity,
    blur,
    saturate,

}