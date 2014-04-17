function Complete(el, data) {

	// Config properties
	this.caseSensitive = false;
	this.exact = true;

	// Data
	this.data = data;

	// DOM elements
	this.inputElement = el;
	this.list = document.createElement('ul');
	this.dropDown = document.createElement('div');
	this.dropDown.appendChild(this.list);
	document.body.appendChild(this.dropDown);

	// Listeners
	var selfie = this; // just bear with me
	el.addEventListener('input', function cb(e) { selfie.lookup(); });

}

// I'm wasteful and stupid. Please improve me.
Complete.prototype.lookup = function() {

	// delete all the previous matches
	while (this.list.firstChild) {
		this.list.firstChild.remove();
	}

	// add the new ones
	var selfie = this;
	this.data.forEach(function(d) {
		var candidate = d;
		var toMatch = selfie.inputElement.value;
		if (!selfie.caseSensitive) {
			candidate = candidate.toLowerCase();
			toMatch = toMatch.toLowerCase();
		}
		if (candidate.startsWith(toMatch)) {
			var optionValue = document.createTextNode(d);
			var newOption = document.createElement('li');
			newOption.appendChild(optionValue);
			selfie.list.appendChild(newOption);
		}
	});
};
