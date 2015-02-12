var express = require('express.io');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();
var env = process.env.NODE_ENV || 'development';

var config = require('./config');
var strandedParser = require('./lib/strandedParser.js');
strandedParser.load(config.saveFolder + config.saveFile);


app.http().io();

// environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if ('development' === env) {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
}
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));




//----listeners client---

/** interface 3D OK */
app.io.route('three ready', function(req) {
    //req.io.emit('testCube');
    req.io.emit('showAxis');
    req.io.emit('drawPlayer', strandedParser.getPlayerPos());
    req.io.emit('drawGrid', strandedParser.getGrid());
    req.io.emit('drawPlayerPath', strandedParser.getAllPlayerPos());
});



// init & launch view
app.get('/', function(req, res) {
    res.render('stranded');

});


//
fs.watchFile(config.saveFolder + config.saveFile, function(curr, prev) {
    if (curr.mtime.valueOf() != prev.mtime.valueOf() || curr.ctime.valueOf() != prev.ctime.valueOf() || true) {
        //console.log('fileChange');
        // do stuff
        strandedParser.reload(config.saveFolder + config.saveFile);
    }
  }
);


app.listen(app.get('port'), function() {
  console.log('Express.io server listening on port ' + app.get('port'));
});
