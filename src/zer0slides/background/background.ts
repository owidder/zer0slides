import {q} from "../selector/selector";

const BACKGROUND_IMAGE_CLASS = "_background_image_";

const image = (selector: string, imgPath: string) => {

    const backgroundContainer = document.querySelector(q(selector));
    backgroundContainer.setAttribute("class", BACKGROUND_IMAGE_CLASS);
    backgroundContainer.setAttribute("style", `background-image: url("${imgPath}")`);
}

export const _addFilterToStyle = (currentStyle: string, filter: string) => {
    const currentFilterMatch = currentStyle.match(/^.*filter\:(.*?);/);
    console.log(currentFilterMatch);
}

const opacity = (selector: string, filterName: string) => {

}

export const background = {
    image,
}