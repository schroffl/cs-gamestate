var CSGameState = require('../index.js')();

// The events ar being reffered to like objects
// in this case the function will be called whenever 'player.state.health' changes
CSGameState.on('player.state.health', function(health, oldValue, data) {
    // If you need any other information (e.g. money) you can access it in the data object
    // In the case of the players money that would be 'data.player.state.money'
	console.log('Health of', data.player.name, 'has changed from', oldValue, 'to', health);
    // OUTPUT: Health of Hansiiii has changed: 72
});
