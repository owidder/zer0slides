import {SlideCore} from './SlideCore';

export const slideCore = new SlideCore();

const setFolderName = (folderName: string) => {
    slideCore.folderName = folderName;
}

export const getFolderName = () => {
    return slideCore.folderName;
}

const addSlide = (_slideName: string, description?: string) => {
    slideCore.addSlide(_slideName, description);
}

export const slideName = () => {
    return slideCore.getCurrentSlide() ? slideCore.getCurrentSlide().name : undefined;
}

export const core = {
    addSlide,
    setFolderName,
    slideName,
}