/* (this example is just an example of the very basic ideas) */

// inputs: none
// outputs: changed
//
// special: JS calls "react()" to invoke the part
//
function FileSelector (id) {
    this.parent = null;
    this.id = id;
    this.isSchematic = false;
    this.inputQueue = [];
    this.isReady = function () { return ( this.inputQueue.length > 0 ); };
    this.react = function () {};  // default - no action
    this.hasInputs = function () {
	return (0 < this.inputQueue.length);
    };
    this.consumeOneEventIfReady = function () {
	if (this.isReady()) {
	    var event = this.inputQueue.pop ();
	    this.react (event);
	}
    };

    this.react = function () { // called from JS, hence, no parameters
	console.log("fileSelector sendChanged()");
        var fileDescriptor = document.getElementById("fileSelector").files[0];
        kernel.send (fileSelector, {pin: 'changed', data: fileDescriptor});
        kernel.io ();
    };
};
