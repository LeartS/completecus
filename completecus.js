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
	this.activateLength = 0;

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
	this.container.className = 'completecus';

	// DOM elements
	var parent = el.parentNode;
	this.inputElement = el; // Input element
	this.list = document.createElement('ul'); // ul
	this.dropDown = document.createElement('div');
	this.dropDown.appendChild(this.list);
	this.container.appendChild(this.dropDown);

	// Internal variables
	this.selectedIndex = 0;

	// Do not display anything until we are focused.
	this.disableDropDown();

	// Listeners
	var selfie = this; // just bear with me
	el.addEventListener('input', function cb(e) { selfie.lookup(); });
	el.addEventListener('blur', function dis(e) { selfie.disableDropDown(); });
	el.addEventListener('focus', function en(e) { selfie.lookup(); });
	el.addEventListener('keydown', function key(e) { selfie.moveSelected(e); });
}

Complete.prototype.moveSelected = function(e) {
	if (this.list.children.length === 0) { return null; }
	if (e.keyCode == 0x28 && this.selectedIndex !== this.list.children.length - 1) { // DOWN
		this.list.children[this.selectedIndex++].classList.remove('selected');
		this.list.children[this.selectedIndex].classList.add('selected');
	}
	else if (e.keyCode == 0x26 && this.selectedIndex !== 0) { // UP
		this.list.children[this.selectedIndex--].classList.remove('selected');
		this.list.children[this.selectedIndex].classList.add('selected');	}
}

Complete.prototype.select = function(e) {

	function optionIndex() {
		var option = e;
		var i = 0;
		while (option = option.previousElementSibling) { ++i; }
		return i;
	}
	this.list.children[this.selectedIndex].classList.remove('selected');
	e.classList.add('selected');
	this.selectedIndex = optionIndex();
}

Complete.prototype.disableDropDown = function() {
	this.dropDown.style.display = 'none';
}

Complete.prototype.enableDropDown = function() {
	this.dropDown.style.display = 'block';
}

Complete.prototype.createOption = function(optionValue) {
	var text = document.createTextNode(optionValue);
	var newOption = document.createElement('li');
	newOption.appendChild(text);
	var selfie = this;
	newOption.addEventListener('mouseover', function(e) { selfie.select(this); });
	this.list.appendChild(newOption);
}

Complete.prototype.lookup = function() {

	if (this.inputElement.value.length < this.activateLength) {
		return null;
	}

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
			this.enableDropDown();
		}
		else {
			this.disableDropDown();
		}
	}
	else {
		for (var i = 0; i < Math.min(this.maxDisplay, matching.length); i++) {
			this.createOption(matching[i]);
		}
		this.selectedIndex = 0;
		this.list.children[this.selectedIndex].classList.add('selected');
		this.enableDropDown();
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
