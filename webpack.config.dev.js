'use strict';

let webpack = require('webpack');
let path = require('path');
let fs = require('fs');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let ProgressBarPlugin = require('progress-bar-webpack-plugin');

let plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),//通过一些计算方式减少chunk的大小
    new ProgressBarPlugin({
        format: '  build [:bar] :percent (:elapsed seconds)',
        clear: false
    }),
    new ExtractTextPlugin('./client/css/main.css', {
        allChunks: true
    })
];
plugins.push(
    new webpack.HotModuleReplacementPlugin(),//启动module的热替换功能
    new webpack.optimize.DedupePlugin(),//打包的时候删除重复或者相似的文件
    new webpack.DefinePlugin({//变量定义插件，定义的变量可以在任何页面拿出来用，即使修改后，再次打开页面还是会变回我们定义的变量
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new webpack.NoErrorsPlugin()//打包的时候强制通过
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
                loader: "style!css"
            }
        ]
    },

    plugins: plugins,

    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
