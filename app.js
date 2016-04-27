var express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http'),
    url = require('url');
app.set('port', process.env.PORT || 3010);
app.use('/', express.static(path.join(__dirname, 'client')));

if('development' == app.get('env')) {
  require('./webpackdev.server')(app, __dirname)
}
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});