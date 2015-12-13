var CSGameState = require('../index.js')({'createServer': false});

var server = require('http').createServer(function(req, res) {
    CSGameState.parse(function(next) {
        req.on('data', function(data) {
            req.rawBody = (req.rawBody || '') + data.toString();
        }).on('end', function() {
            // You can abort the update of the gamestate if you want to
            next(JSON.parse(req.rawBody));
        });
    });
}).listen(3000, '0.0.0.0');

CSGameState.on('<update>', function(data) {
    console.log(data);
});
