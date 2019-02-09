const fs = require('fs');

const foldersToBuild = (publicFolderPath) => {
    const content = fs.readdirSync(publicFolderPath);
    const foldersWithIndexHtml = content.filter(entry => {
        const pathToFolder = `${publicFolderPath}/${entry}`;
        if(fs.lstatSync(pathToFolder).isDirectory()) {
            try {
                fs.accessSync(`${pathToFolder}/index.html`, fs.F_OK);
                return true;
            } catch (e) {
                return false;
            }
        }
    })

    return foldersWithIndexHtml;
}

module.exports = {foldersToBuild}