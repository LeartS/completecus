if (typeof String.prototype.startsWith != 'function') {
	// Implementing String.startsWith for browser that don't support it yet
	// (At the moment only Gecko/Firefox does)
	String.prototype.startsWith = function(str) {
		return this.lastIndexOf(str, 0) === 0;
	};
}



function Complete(el, data) {

	// Config properties
	this.caseSensitive = false;
	this.exact = true;
	this.maxDisplay = 30; // max elements to display in dropdown
	this.emptyMessage = 'No results';
	this.allowDuplicates = false;

	// Data
	this.data = [];
	data.sort();
	var previousElement = data[0]; // TODO: check if data has at least 1 elem
	for (var i = 1; i < data.length; i++) {
		if (data[i] != previousElement || this.allowDuplicates) {
			previousElement = data[i];
			this.data.push(data[i]);
		}
	}

	// Create container element
	var parent = el.parentNode;
	this.container = document.createElement('span');
	parent.insertBefore(this.container, el);
	this.container.appendChild(el);
	this.container.className = 'completejs';

	// DOM elements
	var parent = el.parentNode;
	this.inputElement = el; // Input element
	this.list = document.createElement('ul'); // ul
	this.dropDown = document.createElement('div');
	this.dropDown.appendChild(this.list);
	this.container.appendChild(this.dropDown);

	// Listeners
	var selfie = this; // just bear with me
	el.addEventListener('input', function cb(e) { selfie.lookup(); });
	el.addEventListener('blur', function en(e) { selfie.disableDropDown(); });
	el.addEventListener('focus', function dis(e) { selfie.enableDropDown(); });
	el.addEventListener('keydown', function key(e) { selfie.moveSelected(e); });

	// Initial lookup to be consistent
	this.lookup();
	this.disableDropDown();
	this.selectedIndex = 0;

}

Complete.prototype.toggleSelected = function(e) {
	// IE < 10 does not support this. I do not care.
	e.classList.toggle('selected');
}

Complete.prototype.moveSelected = function(e) {
	if (e.keyCode == 0x28) {
		this.toggleSelected(this.list.children[this.selectedIndex++]);
		this.toggleSelected(this.list.children[this.selectedIndex]);
	}
	else if (e.keyCode == 0x26) { // UP
		this.toggleSelected(this.list.children[this.selectedIndex--]);
		this.toggleSelected(this.list.children[this.selectedIndex]);
	}
}

Complete.prototype.disableDropDown = function() {
	this.dropDown.style.display = 'none';
}

Complete.prototype.enableDropDown = function() {
	this.dropDown.style.display = 'block';
}

Complete.prototype.lookup = function() {

	// delete all the previous matches
	while (this.list.firstChild) {
		this.list.firstChild.remove();
	}

	// get the new ones
	var matching = this.getMatching(this.inputElement.value);

	// Add them to the DOM
	if (matching.length === 0) {
		if (this.emptyMessage) {
			var message = document.createTextNode(this.emptyMessage);
			this.list.appendChild(message);
		}
		else {
			this.disableDropDown();
		}
	}
	else {
		this.enableDropDown();
		for (var i = 0; i < Math.min(this.maxDisplay, matching.length); i++) {
			var optionValue = document.createTextNode(matching[i]);
			var newOption = document.createElement('li');
			newOption.appendChild(optionValue);
			this.list.appendChild(newOption);
		}
	}
};

// I'm wasteful and stupid. Please improve me.
Complete.prototype.getMatching = function() {
	var matching = [];
	var selfie = this;
	this.data.forEach(function(d) {
		var candidate = d;
		var toMatch = selfie.inputElement.value;
		if (!selfie.caseSensitive) {
			candidate = candidate.toLowerCase();
			toMatch = toMatch.toLowerCase();
		}
		if (candidate.startsWith(toMatch)) {
			matching.push(candidate);
		}
	});
	return matching;
}
