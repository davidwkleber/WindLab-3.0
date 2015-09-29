   //
   // This utility was used to add 'client' based info to the recorded data
   //
   //		This is not used now that the measurement data from Arduino includes the items as set by the interface.
   //
   
   function addWindPitchCurrentToData( sendData ) {

	 // send the incoming data to browser with websockets.
		if (sendData.length > 0 ) {
			var now = new Date();
			var formatNow = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear()+'\:'+now.getHours()+'\:'+now.getMinutes()+'\:'+now.getSeconds()+'\:'+now.getMilliseconds();
		
		/* use the same calculation for changin wind speed % to a m/s value
			this is from windsock.ejs. 
			Not the best I know, but hope it works, otherwise windSpeedValue was a percentage...
		*/
		var windSpeedValueText = reutrnWindSpeed(windSpeedValue);

		/* do the same for the pitch angle.
		*/
		var pitchAngleValueText = returnPitchAngle(pitchAngleValue);
		
		/* and dummy load
			NOTE, the magic number 201 is from DLnumFrames in the dummyLoad.ejs file
		*/
		var dummyLoadValueText = returnDummyLoad(dummyLoadValue);
		
			// console.log('SEND update data : '+sendData);
			
			//start with the date
			 var sendJSON = '{\n  \"date\": \"'+formatNow+'\",';
				
				
				
			// put in the JSON from the serial input next
			sendJSON += sendData.substring(1, sendData.length-3);
			// now add the info local to the interface, wind speed, pitch angle and dummy load
			 sendJSON += ", \n  \"windSpeed\": "+windSpeedValueText+",\n";

			sendJSON += "  \"pitchAngle\": "+pitchAngleValueText+",\n";
			sendJSON += "  \"dummyLoad\": "+dummyLoadValueText+"\n";
			sendJSON += "}";
			
			// have to parse the string sendJSON to a JSON object in order to adjust RPM
			dataItem = JSON.parse(sendJSON);
			// adjust RPM due to Arduino issues.
			dataItem.rpm = Math.floor(dataItem.rpm );
	
			// have to put JSON dataItem back into a string to send properly, why things cannot handle JSON objects???
		//	io.emit('updateData', JSON.stringify(dataItem));

			sendJSON = null;
			sendData = null;
			dummyLoadValueText = null;
			pitchAngleValueText = null;
			windSpeedValueText = null;
			now = null;
			receivedData = null;
			jsonClosed = null;
			jsonOpened = null;
			
			// console.log("in SerialListener: the wind speed: "+windSpeedValue);
			// console.log("in SerialListener: the pitch angle: "+pitchAngleValue);
			// console.log("in SerialListener: the dummy load: "+dummyLoadValue);

			console.log("data is: "+JSON.stringify(dataItem));
			return JSON.stringify(dataItem);
		};
		
		};
		

		