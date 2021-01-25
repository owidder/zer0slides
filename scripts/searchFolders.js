const fs = require('fs');

const foldersToBuild = (publicFolderPath, indexName = "index") => {
    const content = fs.readdirSync(publicFolderPath);
    const foldersWithIndexHtml = content.filter(entry => {
        const pathToFolder = `${publicFolderPath}/${entry}`;
        if(fs.lstatSync(pathToFolder).isDirectory()) {
            try {
                fs.accessSync(`${pathToFolder}/${indexName}.html`, fs.F_OK);
                return true;
            } catch (e) {
                return false;
            }
        }
    })

    console.log(`folders: ${foldersWithIndexHtml}`);
    return foldersWithIndexHtml;
}

module.exports = {foldersToBuild}