/* ========================================================================
 * CodeFighter worker instance code
 * ========================================================================
 * Copyright 2014 Laurence Stokes
 * ======================================================================== */

//worker instance to prevent infinite loops

self.addEventListener('message', function(e) {
	var data = e.data;
  
	switch (data.cmd) {
		
		case 'start':
		
		try{
			//make sure we actually invoke test function. If test() doesn't
			//exist user will get a nice reference error.
			eval(data.msg + 'test.call()');
			self.postMessage('done');
		}catch(e){
			//if we catch an error, we know it's not gone infinite...
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