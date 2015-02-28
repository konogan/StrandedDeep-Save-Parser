var express = require('express.io');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();
var env = process.env.NODE_ENV || 'development';
app.http().io();
// environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'jade');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

/*Specific*/
var config = require('./lib/strandParser/config');
var Parser = require('./lib/strandParser');
var parser = new Parser();
parser.init(config);

parser.ev.on('dataExtracted', function() {
  console.log('app on : dataExtracted');
  app.io.sockets.emit('setObjects', parser.getAllObjetcsType());
  app.io.sockets.emit('setBiomes', parser.getAllBiomesType());
  app.io.sockets.emit('setGrid', parser.getGrid());
});

parser.ev.on('pathExtracted', function() {
  console.log('app on : pathExtracted');
  app.io.sockets.emit('setPlayerPath', parser.getPlayerPath());
});

// init & launch view
app.get('/', function(req, res) {
    res.render('index');
});

//----listeners client & emit parser---
app.io.route('DOM_READY', function(req) {
    parser.ev.emit('loadFile');
});

app.listen(app.get('port'), function() {
  console.log('Express.io server listening on port ' + app.get('port'));
});
