const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const {foldersToBuild} = require("./scripts/searchFolders");

const PUBLIC_PATH = "public";

const folders = foldersToBuild(PUBLIC_PATH);

const htmlWebpackPlugins = folders.map(folder => {
    return new HtmlWebpackPlugin({
        filename: `${folder}/index.html`,
        inject: true,
        template: `${PUBLIC_PATH}/${folder}/index.html`,
    })
})

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
        ]
    },
    plugins: [...htmlWebpackPlugins],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};
