function Complete(el, data) {
	var list = document.createElement('ul');
	var dropDown = document.createElement('div');
	dropDown.appendChild(list);
	document.body.appendChild(dropDown);
	el.addEventListener('input', test);

	


	function test(e) {
		while (list.firstChild) {
				list.firstChild.remove();
		}

		console.log(el.value);

		data.forEach(function(d) {
			if (d.startsWith(el.value)) {
				var optionValue = document.createTextNode(d);
				var newOption = document.createElement('li');
				newOption.appendChild(optionValue);
				list.appendChild(newOption);
			}
		});
	}
}
