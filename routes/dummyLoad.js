//
// module for setting Wind Speed of the wind fan
//

var express = require('express');
var router = express.Router();

dummyLoadValue = 1;

// middleware specific to this route, logs timestamps
router.use(function timeLog(req, res, next){
	console.log('dummyLoad Time: ', Date.now());
	next();
})

// define the home page route
router.get('/', function(req, res){
console.log('dummyLoad get');
 	res.redirect('index');
})

router.post('/', function(req, res, next){

console.log('dummyLoad post');

console.log('dummyLoad value in post: ', req.param('dummyLoadValue', null));
	dummyLoadValue = req.param('dummyLoadValue', null);
	//	serialListener.send('interfaceData', { dummyLoadValue: dummyLoadValue });

	var serialCallValue = Math.floor((dummyLoadValue-1)*5);
	
		console.log(' rounded dummy load: '+serialCallValue);

		console.log('dummyLoad serialCall: '+serialCallValue);
	//	res.render('index', {title: 'Dummy Load', seeValue: dummyLoadValue });
 
			console.log('dummyLoad rendered index: '+dummyLoadValue);
		serialListener.send( { arduinoCmd: 'II', value: serialCallValue } );		
			console.log('dummyLoad serialCall done: '+serialCallValue);
	res.send('dummy  load post');

   
})

router.put('/', function(req, res, next){
	var spinnerValue = req.body.value;
	res.seeValue = req.body.value;
	res.redirect('index');
})

router.get('/about', function(req, res){
	res.send('dummy  load about');
})

module.exports = router;

	