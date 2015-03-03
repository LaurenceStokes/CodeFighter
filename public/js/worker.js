self.addEventListener('message', function(e) {
	var data = e.data;
  
	switch (data.cmd) {
		case 'start':
		
		//var t0 = performance.now();
		var string = ''+data.msg;
		if(eval(string +'1==1')){
			//var t1 = performance.now();
			//var timetaken = (t1 - t0);
			self.postMessage('done');
		}
		break;
			 
		case 'stop':
		
		  self.postMessage('WORKER STOPPED: ' + data.msg +
						   '. (buttons will no longer work)');
		  self.close(); // Terminates the worker.
		  
		  break;
		  
		default:
		  break
	};
}, false);