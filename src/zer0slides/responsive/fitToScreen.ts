import * as $ from "jquery";

export const fitToScreen = (rootSelector: string) => {

    const widthFactor = screen.width / 1440;
    const heightFactor = screen.height / 900;

    const factor = Math.min(widthFactor, heightFactor);

    $(rootSelector).css("transform", `scale(${factor})`)
}

export const startFitToScreenPage = () => {
    setInterval(() => {
        fitToScreen("body")
    }, 1000)
}
