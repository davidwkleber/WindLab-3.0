//
// module for setting Wind Speed of the wind fan
//
// var DIserialWriter = require('../serialListener');
// var serialListener = require('../serialListener.js');
// serialListener();


var express = require('express');
var router = express.Router();

windSpeedValue = 0;

// middleware specific to this route, logs timestamps
router.use(function timeLog(req, res, next){
	console.log('windSpeed Time: ', Date.now());
	next();
})

// define the home page route
router.get('/', function(req, res){
console.log('windSpeed get');
 	res.redirect('index');
})

router.post('/', function(req, res, next){

console.log('windSpeed post');
console.log('windSpeed value in post: ', req.param('windSpeedValue', null));
	windSpeedValue = req.param('windSpeedValue', null);
	
	// var serialCallValue = Math.floor(windSpeedValue*0.625);
	var serialCallValue = Math.floor(windSpeedValue);
		console.log(' rounded wind speed: '+serialCallValue);

	console.log('windSpeed serialCallValue: '+serialCallValue);
 
			console.log('windSpeed rendered index: '+windSpeedValue);

		serialListener.send( { arduinoCmd: 'WS', value: serialCallValue } );	
			console.log('windSpeed serialCall done: '+serialCallValue);

	// put must return something, here is a response that does nothing
	res.send('wind speed page');
   
})

router.put('/', function(req, res, next){
	var spinnerValue = req.body.value;
	res.seeValue = req.body.value;
	res.redirect('index');
})

router.get('/about', function(req, res){
	res.send('wind speed About page');
})

module.exports = router;

	