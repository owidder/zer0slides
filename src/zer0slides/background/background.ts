import {q, selector} from "../selector/selector";

const BACKGROUND_IMAGE_CLASS = "_background_image_";

const backgroundImage = (selector: string, imgPath: string) => {

    const backgroundContainer = document.querySelector(q(selector));
    backgroundContainer.setAttribute("class", BACKGROUND_IMAGE_CLASS);
    backgroundContainer.setAttribute("style", `background-image: url("${imgPath}")`);
}

const backgroundFilter = (selector: string, filterName: string) => {

}

export const background = {
    backgroundImage,
}