import {q} from "../selector/selector";

const BACKGROUND_IMAGE_CLASS = "_background_image_";

const image = (selector: string, imgPath: string) => {

    const backgroundContainer = document.querySelector(q(selector));
    backgroundContainer.setAttribute("class", BACKGROUND_IMAGE_CLASS);
    backgroundContainer.setAttribute("style", `background-image: url("${imgPath}")`);
}

export const _addFilterToStyle = (currentStyle: string, filter: string) => {
    const filterRegex = /(^.*)filter\:(.*?);(.*)$/;
    if(filterRegex.test(currentStyle)) {
        const currentFilterMatch = currentStyle.match(filterRegex);
        return `${currentFilterMatch[1]}filter:${currentFilterMatch[2]} ${filter};${currentFilterMatch[3]}`;
    }

    return `${currentStyle} filter: ${filter};`
}

const opacity = (selector: string, filterName: string) => {

}

export const background = {
    image,
}