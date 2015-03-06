//worker instance to prevent infinite loops

self.addEventListener('message', function(e) {
	var data = e.data;
  
	switch (data.cmd) {
		
		case 'start':
		
		try{
			eval(data.msg);
			self.postMessage('done');
		}catch(e){
			self.postMessage('done');
		}
		break;
			 
		case 'stop':
		
			self.postMessage('WORKER STOPPED');
			self.close(); // Terminates the worker.
			break;
		  
		default:
			break;
	};
}, false);