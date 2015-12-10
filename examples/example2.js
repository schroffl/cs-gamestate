var CSGameState = require('../index.js');

CSGameState.on('round.bomb', function(bombState, data) {
	switch(bombState) {
        case 'planted':
            console.log(new Date(), 'The bomb has been planted');
            break;

        case 'defused':
            console.log(new Date(), 'The bomb has been defused');
            break;

        case 'exploded':
            console.log(new Date(), 'The bomb blew up');
            break;
    }
});
