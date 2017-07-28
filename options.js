(function() {
const page = {
	ignoreListTextArea: document.getElementById('ignoreListTextArea'),
	saveButton: document.getElementById('saveButton'),
};

OpenerDetectorConfig.get().then((config) => {
	const ignoreList = config.getIgnoreList();

	page.saveButton.addEventListener('click', (e) => {
		e.preventDefault();
		const newList = [];
		for (let line of page.ignoreListTextArea.value.split('\n')) {
			const trimmedLine = line.trim();
			if (trimmedLine.length > 0) {
				newList.push(trimmedLine);
			}
		}
		ignoreList.setItems(newList);
		config.save().then(
				() => {
					alert("Changes saved.");
				},
				(error) => {
					alert("An error occurred when saving the ignore list. (See console for details.)");
					console.error(error);
				});
	});

	page.ignoreListTextArea.value = ignoreList.getItems().join('\n');

	// Activate the text area now that it has content in it
	page.ignoreListTextArea.disabled = false;
	page.saveButton.disabled = false;
});
})();
