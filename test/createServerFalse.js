var CSGameState = require('../index.js')({'createServer': false});

var server = require('http').createServer(function(req, res) {
    CSGameState.parse(req, res);
}).listen(3000, '0.0.0.0');

CSGameState.on('<update>', function(data) {
    console.log(data);
});
