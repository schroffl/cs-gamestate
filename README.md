# CS:GO Game Integration (node.js) [![npm version](https://badge.fury.io/js/cs-gamestate.svg)](https://www.npmjs.com/package/cs-gamestate)
If you don't know what CS:GO Game State Integration is, I suggest you to read up on [this article](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration) published by Valve in their wiki.

## Installation
```javascript
npm install cs-gamestate
```

## Bomb Timer
Valve has released an [update](http://blog.counter-strike.net/index.php/2015/12/13409/) on the 17th of December 2015. The event of the bomb being planted is now delayed by a random amount of time. If you subscribe to `round.bomb`, **be aware of this!**

## Example
```javascript
const CSGameState = new (require('cs-gamestate'))(3000, '0.0.0.0'); // The options (port, host) are optional, these are the defaults

// The events are being reffered to like objects.
// In this case the function will be called whenever 'player.state.health' (the players health) changes

CSGameState.on('player.state.health', (health, oldValue, data) => {
	// If you need any other information (e.g. money) you can access it in the data object
	// For the players money that would be 'data.player.state.money'

	console.log('Health of', data.player.name, 'has changed from', oldValue, 'to', health);
	// OUTPUT: Health of Hansiiii has changed from 100 to 72
});
```

You can also subscribe to any update sent by the client by using
```javascript
CSGameState.on('<update>', data => {
	// Crunch the data...
});
```

## <a name="options"></a>Options
You can specify options when calling cs-gamestate like this `require('cs-gamesate')(options, port, host)`

#### <a name="option-create-server"></a>createServer *(true)*
If you don't want cs-gamestate to create a server you can set this to `false`.  
You can then later call [CSGameState.parse](#method-parse) passing an object.

## <a name="methods"></a>Methods

#### <a name="methods-parse"></a>.parse(*object*)
You will need to use this function if you didn't create a server automatically.
This can be useful if you don't always want to update the state, but only if certain conditions are met.
