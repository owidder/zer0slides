import {getFolderName} from '../core/core';

export const pathTo = (name: string, extension?: string) => {
    const folderName = getFolderName();

    const fullname = extension ? `${name}.${extension}` : name;

    if(!folderName) {
        return `./${fullname}`;
    }

    return `./${folderName}/${fullname}`
}

export const pathToHtml = (name: string) => {
    return pathTo(name, "html");
}
