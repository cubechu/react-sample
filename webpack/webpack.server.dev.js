var webpack = require('webpack');
var path = require('path');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.dev');
var proxy = require('proxy-middleware');
var url = require('url');

module.exports = function (app) {
    
    app.use('/js/export', proxy(url.parse('http://localhost:8081/')));

    var server = new WebpackDevServer(webpack(config), {
        contentBase: './client/',
        hot: true,
        noInfo: false,
        inline: true,
        quiet: false,
        stats: {colors: true}
    });

    server.listen(8081, 'localhost', function (err) {
        if (err) console.log(err);
        console.log('socketio listen 8081');
    });
};
