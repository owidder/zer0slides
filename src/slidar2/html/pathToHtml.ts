import {getFolderName} from '../core/core';

export const pathToHtml = (name: string) => {
    const folderName = getFolderName();

    if(!folderName) {
        return `slides/${name}.html`;
    }

    return `slides/${folderName}/html/${name}.html`
}
