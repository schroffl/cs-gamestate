var csGameState = require('../index.js');
var server = new csGamestate();

server.on('round.bomb', function(bombState, data) {
	switch(bombState) {
		case 'planted':
			console.log(new Date(), 'The bomb has been planted', data);
			BombTimer10 = setTimeout(function() {
				console.log('\u0007');
				BombTimer5 = setTimeout(function() {
					console.log('\u0007');
				}, 5000);
			}, 30000);
			break;

		case 'defused':
			clearTimeout(BombTimer5);
			clearTimeout(BombTimer10);
			break;
	}
}).on('round.phase', function(phase, data) {
	switch(phase) {
		case 'over':
			clearTimeout(BombTimer5);
			clearTimeout(BombTimer10);
			break;
	}
});
