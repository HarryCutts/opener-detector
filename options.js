(function() {
const page = {
	ignoreListTextArea: document.getElementById('ignoreListTextArea'),
	reportSameOriginCheckbox: document.getElementById('reportSameOriginCheckbox'),
	saveButton: document.getElementById('saveButton'),
	saveConfirmMessage: document.getElementById('saveConfirmMessage'),
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
		config.setReportSameOriginVulnerabilities(page.reportSameOriginCheckbox.checked);
		config.save().then(
				() => {
					saveConfirmMessage.innerText = "Changes saved.";
					saveConfirmMessage.style.display = 'block';
				},
				(error) => {
					saveConfirmMessage.innerText = "An error occurred when saving the ignore list. (See console for details.)";
					saveConfirmMessage.style.display = 'block';
					console.error(error);
				});
	});

	page.ignoreListTextArea.value = ignoreList.getItems().join('\n');
	page.reportSameOriginCheckbox.checked = config.getReportSameOriginVulnerabilities();

	// Activate the page controls now that their values are correct
	page.ignoreListTextArea.disabled = false;
	page.reportSameOriginCheckbox.disabled = false;
	page.saveButton.disabled = false;
});
})();
