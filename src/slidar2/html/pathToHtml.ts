import {getFolderName} from '../core/core';

export const pathTo = (name: string, extension?: string) => {
    const folderName = getFolderName();

    const fullname = extension ? `${name}.${extension}` : name;

    if(!folderName) {
        return `slides/${fullname}`;
    }

    return `slides/${folderName}/html/${fullname}`
}

export const pathToHtml = (name: string) => {
    return pathTo(name, "html");
}
