# CS:GO Game Integration (node.js) [![npm version](https://badge.fury.io/js/cs-gamestate.svg)](https://www.npmjs.com/package/cs-gamestate)
If you don't know what CS:GO Game State Integration is, I suggest you to read [this](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration) article published by Valve in their wiki.

## Installation
To install this package simply run: `npm install cs-gamestate`

## Example
```javascript
var CSGameState = require('../index.js')();

// The events ar being reffered to like objects
// in this case the function will be called whenever 'player.state.health' changes
CSGameState.on('player.state.health', function(health, oldValue, data) {
    // If you need any other information (e.g. money) you can access it in the data object
    // In the case of the players money that would be 'data.player.state.money'
	console.log('Health of', data.player.name, 'has changed from', oldValue, 'to', health);
    // OUTPUT: Health of Hansiiii has changed from 100 to 72
});
```

You can also subscribe to any update sent by the client by using
```javascript
CSGameState.on('<update>', function(data) {
	// Crunch the data...
});
```
