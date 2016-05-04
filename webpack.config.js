'use strict';

let webpack = require('webpack');
let path = require('path');
let fs = require('fs');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let ProgressBarPlugin = require('progress-bar-webpack-plugin');

let plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new ProgressBarPlugin({
        format: '  build [:bar] :percent (:elapsed seconds)',
        clear: false
    }),
    new ExtractTextPlugin('./client/css/main.css', {
        allChunks: true
    })
];
plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    function () {
        this.plugin("done", function (stats) {
            let jsonStats = stats.toJson({
                chunkModules: true
            });
            fs.writeFileSync(
                __dirname + "/webpack-assets.json",
                JSON.stringify(jsonStats.assetsByChunkName)
            );
        });
    },
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new webpack.NoErrorsPlugin()
);

function getPagesNames(dirPath) {
    let filesNames = fs.readdirSync(dirPath);
    let entries = {};

    for (let fileName of filesNames) {
        entries[fileName.split('.').shift() || fileName] = `${ dirPath }/${ fileName }`;
    }

    return entries;
}

module.exports = {
    entry: getPagesNames(__dirname + '/client/js/page'),

    output: {
        path: path.join(__dirname, './client/js/export/'),
        publicPath: "./client/",
        filename: '[name].js'
    },

    module: {
        loaders: [
            // Load ES6/JSX
            {
                loader: "babel-loader",
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ],
                test: /\.jsx?$/,
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'react']
                }
            },

            // Load styles
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }
        ]
    },

    plugins: plugins,

    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
