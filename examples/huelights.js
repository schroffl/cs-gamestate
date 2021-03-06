/* This sample code will fade the color of your HUE Lights from green to red depending on your health */
// Dependencies:
// - cs-gamestate
// - request

const CSGameState = new (require('cs-gamestate'))(3000, '0.0.0.0');
const request = require('request');

CSGameState.on('player.state.health', function(health) {
	// Fade the color from GREEN to RED according to the players health
	const hue = health / 100 * 21845;
    
	request({
		'method': 'PUT',
		'uri': 'http://<ip_of_your_bridge>:<port>/api/csgameint/lights/<id_of_your_light>/state',
		'body': JSON.stringify({
			'transitiontime': 0,
			'bri': 254,
			'sat': 254,
			'hue': hue,
			'on': health > 0 ? true : false
		})
	});
});
