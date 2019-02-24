const fs = require('fs')
const version = require("./package.json").version;

fs.readFile("./README.md", 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    const result = data.replace(/zer0slides\@v\d.\d.\d/g, `zer0slides\@v${version}`).replace(/z0\.\d.\d.\d\./g, `z0.${version}.`);

    fs.writeFile("./README.md", result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});
