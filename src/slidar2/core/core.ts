import {SlideCore} from './SlideCore';

export const slideCore = new SlideCore();

let _folderName: string | undefined;

const setFolderName = (folderName: string) => {
    _folderName = folderName;
}

export const getFolderName = () => {
    return _folderName;
}

const addSlide = (slideName: string) => {
    slideCore.addSlide(slideName);
}

export const core = {
    addSlide,
    setFolderName,
}