
module.exports = serialListener;

var portConfig = require('./portConfig.json');

var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

console.log('ports ' + portConfig.measurement.port);

	DIserialPort = new SerialPort(portConfig.measurement.port, {
		baudrate: portConfig.measurement.baudrate,
		
		parser: serialport.parsers.readline("EOL"),
	}, function (err) {
		if (err) console.log('Eroror opening measurement  port: ' +  portConfig.measurement.port);
	});


function sleep(time, callback) {
// serialListener.prototype.sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
};


/*
var socketServer;
var socketio = require('socket.io');
socketServer = socketio.listen(app, true);
*/
function serialListener() {
}
function socketInit() {

	//
	//http://www.barryvandam.com/node-js-communicating-with-arduino/ 
	//copied from the server.js file
	var receivedData = "";
    var sendData = "";
	var delimiter = "\n";
	
 console.log('serialListenerInit called ');

io = require('socket.io').listen(1337);


console.log('serialListener: setup connection now');

io.sockets.on('connection', function(socket){
	console.log('a user connected');
	console.log('connected socket: '+socket.id);


    socket.on('disconnect', function(){
    console.log('user disconnected');
    console.log('socket disconnected' + socket.id+ " " + socket.disconnected);
  });
  

});
};
 
   DIserialPort.on("open", function () {
		console.log('serialListener.DIserialPort.on Open ' + portConfig.measurement.port);
		socketInit();

        sleep(2000, function() {
		});
		DIserialPort.write('AA', function(err, results) {
				console.log('DI_err ' + err);
				console.log('DI_results ' + results);
			});

	});
 
 
 var sendData = '';
 var receivedData = '';
 var chunksIn = 0;
 function handleDIserialPortData(data) {
 console.log('serialListener: got data '+data);
io.emit('updateData', data);

// io.emit('updateData', returnMeasurementsWithPower(data));

 /*
		chunksIn = chunksIn+1;
        receivedData += data.toString();

			var jsonOpened = receivedData.indexOf('{');
			var jsonClosed = receivedData.indexOf('}', jsonOpened);

		if( jsonClosed !== -1 && jsonOpened !== -1 ) {
			if ( jsonClosed > jsonOpened ) {
				sendData = receivedData.substring(jsonOpened, jsonClosed+1);
				receivedData = receivedData.substring(jsonClosed+2, receivedData.length);'';
				chunksIn = 0;
			}
		 }
         // send the incoming data to browser with websockets.
		if (sendData.length > 0 ) {
		//	var measurementsToSend = returnMeasurementsWithPower(sendData);

// console.log('serialListener: got data '+measurementsToSend);
			 // io.emit('updateData', measurementsToSend);
io.emit('updateData', sendData);
			sendData = null;
			receivedData = null;
			jsonClosed = null;
			jsonOpened = null;
			measurementsToSend = null;

		};
		*/
	}; 
 
 function returnMeasurementsWithPower( dataIn ) {

			var thisMeasurement = JSON.parse(dataIn);
			var powerCalculation = +thisMeasurement.current * +thisMeasurement.voltage / 1000;
			
 			 var sendJSON = "{\n\t  \"power\": \""+powerCalculation+'\",';
			// put in the JSON from the serial input next
			sendJSON += dataIn.substring(1, dataIn.length);
		return sendJSON;
}


 // get a message from the parent Node Express processes
 // 
 //		Used by windSpeed, pitchAngle and dummyLoad to send the values for arduino
 //
 //		results in Arduino being sent code and values via serial port
 //
 process.on('message', function(m) {

	console.log('on message: '+ m.arduinoCmd+m.value);
			DIserialPort.write(m.arduinoCmd+m.value, function(err, results) {
				console.log('DI_err ' + err);
				console.log('DI_results ' + results);
			});

});


DIserialPort.on('data', handleDIserialPortData) ;
