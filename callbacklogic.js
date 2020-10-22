function CallbackLogic () {
    // input pins = "file"                            // ("timeout" will be added later)
    // output pins = "good", "error" , "abort" and "no response"

    // Interim version! This will be upgraded later!
    // In this version, the timer code is conflated with the Callbacklogic code,
    //   but, the timer should be a separate part.

    // N.B. note the absence of "throw"... (not needed, throw is just another form of data transfer)
    
    this.parent = null;
    this.id = id;
    this.isSchematic = false;
    this.inputQueue = [];
    this.isReady = function () { return ( this.inputQueue.length > 0 ); };
    this.hasInputs = function () {
	return (0 < this.inputQueue.length);
    };
    this.consumeOneEventIfReady = function () {
	if (this.isReady()) {
	    var event = this.inputQueue.pop ();
	    this.react (event);
	}
    };

    this.start (HTMLevent) {
    };
    this.react = function (AGevent) {
	var reader;
	// lots of gory details here
	// we are at the interface between HTML (the O/S) and AG, so there are lots of details, by definition...
	// we are converting HTML events into AG events...
	if (AGevent.pin == "file") {
	    this.start(
		// start the reader, set up callbacks, set timeout
		// (this is interim code and will be upgraded later, e.g. timer will
		//  moved to its own component)
		reader = new FileReader();
		reader.onload = function (e) { this.react ("fileOnload", reader); };
		reader.onerror = function (e) { this.react ("fileOnerror", reader); };
		reader.onabort = function (e) { this.react ("fileOnabort", reader); };
		setTimeout(function () { this.react ("timeout", reader);}, 1000);
		reader.readAsText (HTMLevent.data);
	    } else if (AGevent.pin == "fileOnload") {
		clearTimeout();
		kernel.send("good", reader);
		kernel.io();
	    } else if (AGevent.pin == "fileOnerror") {
		clearTimeout();
		kernel.send("error", reader);
		kernel.io();
	    } else if (AGevent.pin == "fileOnabort") {
		clearTimeout();
		kernel.send("abort", reader);
		kernel.io();
	    } else if (AGevent.pin == "timeout") {
		clearTimeout();
		reader && reader.abort ();
		kernel.send("no response", reader);
		kernel.io();
	    } else {
		clearTimeout(); 
		reader && reader.abort ();
		send ("error", "event not understood by CallbackLogic part: " + AGevent.pin);
	}
    }; // default
};
