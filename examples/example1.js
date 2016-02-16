const CSGameState = new (require('../index.js'))(3000, '0.0.0.0');

// The events are being reffered to like objects
// in this case the function will be called whenever 'player.state.health' changes
CSGameState.on('player.state.health', function(health, previous, data) {
    // If you need any other information (e.g. money) you can access it via the data object
    // In the case of the players money that would be 'data.player.state.money'
	console.log('Health of', data.player.name, 'has changed from', previous, 'to', health);
    // => OUTPUT: Health of Hansiiii has changed: 72
});