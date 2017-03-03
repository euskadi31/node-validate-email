const webpack = require("webpack");

const env = process.env.NODE_ENV || "development";

const plugins = [
    new webpack.NamedModulesPlugin(),
];

module.exports = {
    entry: {
        "validate": "./src/validate.ts",
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist",
        libraryTarget : "umd",
    },
    devtool: "source-map",
    resolve: {
        extensions: ["", ".webpack.js", "web.js", ".ts", ".js"]
    },
    plugins,
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            }
        ],
        preLoaders: [
            {
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.ts$/,
                loader: 'tslint-loader'
            }
        ]
    },
    externals: {}
};
