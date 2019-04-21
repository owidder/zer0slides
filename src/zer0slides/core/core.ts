import {SlideCore} from './SlideCore';
import {SlideConfig} from "./Slide";

export const slideCore = new SlideCore();

const setFolderName = (folderName: string) => {
    slideCore.folderName = folderName;
}

export const getFolderName = () => {
    return slideCore.folderName;
}

const addSlide = (_slideName: string, description?: string, doPerformToCurrentStep = true, centerCurrentLine = false, useTippyAsDefault = false) => {
    slideCore.addSlide(_slideName, description, undefined, doPerformToCurrentStep, centerCurrentLine, useTippyAsDefault);
}

const addSlideWithConfig = (slideName: string, description?: string, slideConfig?: SlideConfig) => {
    slideCore.addSlideWithConfig(slideName, description, slideConfig);
}

export const slideName = () => {
    return slideCore.getCurrentSlide() ? slideCore.getCurrentSlide().name : undefined;
}

export const core = {
    addSlide,
    addSlideWithConfig,
    setFolderName,
    slideName,
}