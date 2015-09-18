//
// module for setting Pitch Angle of the wind turbine blades
//

var express = require('express');
var router = express.Router();

pitchAngleValue = 1;

// middleware specific to this route, logs timestamps
router.use(function timeLog(req, res, next){
	console.log('pitchAngle Time: ', Date.now());
	next();
})

// define the home page route
router.get('/', function(req, res){
console.log('pitchAngle get');
 	res.redirect('/');
})


// Post handler for the PitchAngle
//
router.post('/', function(req, res, next){

	// deterine if the movement is forward or backwards, based upon the 
console.log('pitchAngle post');
	var forwardOrBack = 'F';
	var diffAngle = 0;
	var serialValue = 0;
	pitchAngleValue = req.param('pitchAngleValue', null);
	
	//		serialListener.send('interfaceData', { pitchAngleValue: pitchAngleValue });

	
		console.log('pitchAngleValue param in PA.js '+ req.param('pitchAngleValue', null));
		console.log('pitchAngleValue value  in PA.js '+ pitchAngleValue);

	if (pitchAngleValue == "down" ) {
			forwardOrBack = 'P';
			pitchAngleValue = '';
	} else if ( pitchAngleValue == "up" ) {
			forwardOrBack = 'M';
			pitchAngleValue = '';
	} else {
			forwardOrBack = 'A';
			pitchAngleValue *= 10;
	}
		serialListener.send( { arduinoCmd: 'P'+forwardOrBack, value: pitchAngleValue } );		

	
	res.send('pitch angle page');
})

router.put('/', function(req, res, next){
	var spinnerValue = req.body.value;
	res.seeValue = req.body.value;
	res.redirect('/');
})

router.get('/about', function(req, res){
	res.send('About page');
})

module.exports = router;

	