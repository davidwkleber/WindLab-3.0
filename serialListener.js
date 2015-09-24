
module.exports = serialListener;

// serialListener
//
//	This is the module which handles communication between the Arduino Serial Port
//	Data is written to and read from the COM port via the node package serialport
//	The incomming data is passed onto the web client via web sockets.
//

var firstData = true;

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

      //  sleep(2000, function() {
		// });
		setTimeout(stopDataFlow, 2000);



	});
 
 
 var sendData = '';
 var receivedData = '';
 var chunksIn = 0;
 
 
 function handleDIserialPortData(data) {
	// drop the first packet that comes out the Arduino
	if( firstData == false ) {
  // console.log('serialListener: got data '+data);

 // Emit the data without any processing at all, no power added, no checking for a complete JSON package.
 // io.emit('updateData', data);

 // Emit the data after adding the Power 
	var jsonWithPower = returnMeasurementsWithPower(data);
	 console.log('serialListener: send data '+jsonWithPower);
	io.emit('updateData', jsonWithPower);

 /*
	// parse the incomming COM data and 'extract' one complete JSON object from it
	//
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
		
		} else {
			console.log('serialListener: got FIRST data '+data);
			firstData = false;
			//serialport.flush(); // added by Maik, should empty old data in serial buffer !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		}
		data = null;
	}; 
 
 function returnMeasurementsWithPower( dataIn ) {

			var thisMeasurement = JSON.parse(dataIn);
			var powerCalculation = +thisMeasurement.current * +thisMeasurement.voltage / 1000;
			
 			 var sendJSON = "\n{\n\t  \"power\": \""+powerCalculation+'\",';
			// put in the JSON from the serial input next
			sendJSON += dataIn.substring(3, dataIn.length);
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


// an attempt to set dtr and rts
// but the serialPort.set command is not known
//	this despite the fact that the code came from a github example...
function setupComPort() {
  console.log('setupComPort');
    //NOTE: you actually de-assert rts and dtr to toggle!
    DIserialPort.set({rts:true, dtr:true}, function(err, something) {
      console.log('Com Port Setup');
        setTimeout(startDataFlow, 5000);
    });
}

//
//	initialize the data flow, 
//		Sending a stop does not really fix anything, but hey good try.
//
//		after sending the stop, it waits and sends a start
function stopDataFlow() {
		firstData = true;
		  console.log('stopDataFlow');

		DIserialPort.write('ST', function(err, results) {
				console.log('return from ST');
				console.log('DI_err ' + err);
				console.log('DI_results ' + results);
			});
		setTimeout(startDataFlow, 2000);

}

//
//	Starrt the data flow 
//	send the Arduino WebShield an AA 
//	
//		first data packet is dumped for good measure.
function startDataFlow() {
		  console.log('startDataFlow');

		firstData = true;
		DIserialPort.write('AA', function(err, results) {
				console.log('return from AA');
				console.log('DI_err ' + err);
				console.log('DI_results ' + results);
			});
}