var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');
//config.entry.app.unshift("webpack-dev-server/client?http://localhost:8081/");
var proxy = require('proxy-middleware');
var url = require('url');

module.exports = function (app) {

    // 使用8081端口
    app.use('/js/export', proxy(url.parse('http://localhost:8081/js/export')));
    var server = new WebpackDevServer(webpack(config), {
        contentBase: './client/js/export/',
        hot: true,
        noInfo: false,
        inline: true,
        stats: {colors: true}
    }).listen(8081, 'localhost', function (err) {
        if (err) console.log(err);
        console.log('socketio listen 8081');
    });
};
/*
 {
 contentBase: './client/js/export/',
 hot: true,
 noInfo: false,
 inline: true,
 stats: {colors: true}
 }*/
