import {SlideCore} from './SlideCore';

export const slideCore = new SlideCore();

let _folderName: string | undefined;

const setFolderName = (folderName: string) => {
    _folderName = folderName;
}

export const getFolderName = () => {
    return _folderName;
}

const addSlide = (_slideName: string) => {
    slideCore.addSlide(_slideName);
}

export const slideName = () => {
    return slideCore.getCurrentSlide().name;
}

export const core = {
    addSlide,
    setFolderName,
    slideName,
}