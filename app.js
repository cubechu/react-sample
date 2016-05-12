var express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http'),
    url = require('url');

app.set('port', process.env.PORT || 3010);
app.use('/', express.static(path.join(__dirname, 'client')));

if ('development' == app.get('env')) {
    require('./webpack.server.dev')(app, __dirname)
}else if ('production' == app.get('env')) {
    require('./webpack.server.build')(app, __dirname)
}
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/web/index.html');
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
}); 


