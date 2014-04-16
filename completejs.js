function Complete(el, data) {

	// Config properties
	this.caseSensitive = false;
	this.exact = true;

	// DOM elements
	var list = document.createElement('ul');
	var dropDown = document.createElement('div');
	dropDown.appendChild(list);
	document.body.appendChild(dropDown);

	// Listeners
	el.addEventListener('input', lookup);

	// I'm wasteful and stupid. Please improve me.
	function lookup(e) {

		// delete all the previous matches
		while (list.firstChild) {
				list.firstChild.remove();
		}

		// add the new ones
		data.forEach(function(d) {
			var candidate = d;
			var toMatch = el.value;
			if (!this.caseSensitive) {
				candidate = candidate.toLowerCase();
				toMatch = toMatch.toLowerCase();
			}
			if (candidate.startsWith(toMatch)) {
				var optionValue = document.createTextNode(d);
				var newOption = document.createElement('li');
				newOption.appendChild(optionValue);
				list.appendChild(newOption);
			}
		});
	}
}
